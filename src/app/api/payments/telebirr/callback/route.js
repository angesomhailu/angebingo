import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDbConnection } from '@/src/lib/mysql';

export async function POST(req) {
  try {
    const encryptedText = await req.text();

    if (!encryptedText) {
      return NextResponse.json({ code: 400, message: 'Empty body' }, { status: 400 });
    }

    const publicKey = process.env.TELEBIRR_PUBLIC_KEY;

    if (!publicKey) {
      console.warn("Telebirr public key is not configured. Callback cannot be verified. Returning error.");
      return NextResponse.json({ code: 500, message: 'Callback verification disabled (missing public key)' }, { status: 500 });
    }

    // Decrypt the callback notification using Telebirr's RSA Public Key
    let pemKey = publicKey;
    if (!pemKey.includes('-----BEGIN PUBLIC KEY-----')) {
      pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    }

    let txDetails;
    try {
      const buffer = Buffer.from(encryptedText, 'base64');
      const decrypted = crypto.publicDecrypt({
        key: pemKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
      }, buffer);
      txDetails = JSON.parse(decrypted.toString('utf8'));
    } catch (decryptErr) {
      console.error("Failed to decrypt Telebirr callback:", decryptErr);
      return NextResponse.json({ code: 400, message: 'Decryption failed' }, { status: 400 });
    }

    console.log("Decrypted Telebirr callback transaction details:", txDetails);

    const { outTradeNo, totalAmount, tradeStatus } = txDetails;

    // Check if the trade status is successful
    const isSuccess = tradeStatus && 
      (tradeStatus.toLowerCase() === 'completed' || 
       tradeStatus.toLowerCase() === 'success' || 
       tradeStatus === '0');

    if (isSuccess) {
      // Parse username from outTradeNo (format: DEP_timestamp_username)
      const parts = outTradeNo.split('_');
      if (parts.length >= 3 && parts[0] === 'DEP') {
        const username = parts.slice(2).join('_');
        const amount = Number(totalAmount);

        if (username && amount > 0) {
          const pool = await getDbConnection();
          
          // Check if this transaction was already processed to avoid double deposits
          const [existing] = await pool.query(
            'SELECT * FROM transactions WHERE username = ? AND type = ? AND amount = ? AND created_at >= NOW() - INTERVAL 1 DAY',
            [username, 'deposit_telebirr', amount]
          );

          let duplicate = false;
          for (const tx of existing) {
            // Check if it was processed in the last 5 minutes (or match exact timestamp if needed)
            if (new Date() - new Date(tx.created_at) < 5 * 60 * 1000) {
              duplicate = true;
              break;
            }
          }

          if (!duplicate) {
            await pool.query(
              'INSERT INTO transactions (username, type, amount) VALUES (?, ?, ?)',
              [username, 'deposit_telebirr', amount]
            );
            console.log(`Successfully credited ꓭ${amount} to ${username} via Telebirr callback.`);
          } else {
            console.log(`Duplicate Telebirr transaction callback for ${outTradeNo} ignored.`);
          }
        }
      }
    }

    // Telebirr expects a success response
    return NextResponse.json({ code: 0, message: 'success' });

  } catch (err) {
    console.error("Error in Telebirr callback route:", err);
    return NextResponse.json({ code: 500, message: 'Internal server error: ' + err.message }, { status: 500 });
  }
}
