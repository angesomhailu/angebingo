import { NextResponse } from 'next/server';
import { getDbConnection } from '@/src/lib/mysql';

export async function POST(req) {
  try {
    const { outTradeNo, amount } = await req.json();

    if (!outTradeNo || !amount) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const parts = outTradeNo.split('_');
    if (parts.length >= 3 && parts[0] === 'mock') {
      const username = parts.slice(2).join('_');
      const parsedAmount = Number(amount);

      if (username && parsedAmount > 0) {
        const pool = await getDbConnection();
        await pool.query(
          'INSERT INTO transactions (username, type, amount) VALUES (?, ?, ?)',
          [username, 'deposit_telebirr', parsedAmount]
        );
        console.log(`[MOCK] Credited ꓭ${parsedAmount} to ${username} via Telebirr mock callback.`);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: 'Invalid mock transaction' }, { status: 400 });
  } catch (err) {
    console.error("Mock callback failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
