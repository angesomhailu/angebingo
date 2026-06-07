import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { amount, username } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Load Telebirr credentials
    const appId = process.env.TELEBIRR_APP_ID;
    const appKey = process.env.TELEBIRR_APP_KEY;
    const shortCode = process.env.TELEBIRR_SHORT_CODE;
    const publicKey = process.env.TELEBIRR_PUBLIC_KEY;
    const apiUrl = process.env.TELEBIRR_API_URL || 'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeWebPay';
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    // Check if real credentials are provided
    if (!appId || !appKey || !shortCode || !publicKey) {
      console.warn("Telebirr credentials are not fully configured in environment variables. Falling back to sandbox simulation mode.");
      
      // Sandbox fallback mode - redirect to a mock checkout URL inside the app
      const mockOutTradeNo = `mock_${Date.now()}_${username}`;
      const mockPayUrl = `${appUrl}/lobby?telebirr_mock_pay=true&outTradeNo=${mockOutTradeNo}&amount=${amount}`;
      return NextResponse.json({ success: true, toPayUrl: mockPayUrl });
    }

    // Generate unique outTradeNo
    const outTradeNo = `DEP_${Date.now()}_${username}`;
    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = String(Date.now());

    const params = {
      appId,
      appKey,
      nonce,
      notifyUrl: `${appUrl}/api/payments/telebirr/callback`,
      outTradeNo,
      receiveName: 'AngeBingo',
      returnApp: 'com.angebingo.app',
      returnUrl: `${appUrl}/lobby?status=success`,
      shortCode,
      subject: `Bingo deposit - ${username}`,
      timeoutExpress: '120', // 2 hours
      timestamp,
      totalAmount: String(amount)
    };

    // Generate SHA-256 signature
    const sortedKeys = Object.keys(params).sort();
    const signatureStr = sortedKeys
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    const sign = crypto.createHash('sha256').update(signatureStr).digest('hex');

    // Encrypt payload using Telebirr RSA Public Key
    let pemKey = publicKey;
    if (!pemKey.includes('-----BEGIN PUBLIC KEY-----')) {
      pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    }

    const buffer = Buffer.from(JSON.stringify(params), 'utf8');
    const ussd = crypto.publicEncrypt({
      key: pemKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer).toString('base64');

    const payload = {
      appid: appId,
      sign,
      ussd
    };

    // Call Telebirr API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.code === 200 || result.code === '200') {
      const payUrl = result.data?.toPayUrl;
      return NextResponse.json({ success: true, toPayUrl: payUrl });
    } else {
      console.error("Telebirr H5 web pay API error:", result);
      return NextResponse.json({ 
        error: `Telebirr API returned error code ${result.code}: ${result.message || 'Unknown error'}` 
      }, { status: 500 });
    }

  } catch (err) {
    console.error("Telebirr payment initiation failed:", err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}
