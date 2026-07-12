import nodemailer from 'nodemailer';

/**
 * Generic function to send email via SMTP.
 * Fallbacks to console logging if SMTP_USER or SMTP_PASS are not configured in environment.
 */
export async function sendEmail({ to, subject, html, text }) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.log('\n=== [EMAIL FALLBACK LOG] ===');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${text || html}`);
    console.log('============================\n');
    return { success: true, fallback: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const from = process.env.SMTP_FROM || `"AngeBingo" <${user}>`;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Error] Failed to send email:', error);
    throw error;
  }
}

/**
 * Send a verification code to user's email.
 */
export async function sendVerificationEmail(email, name, code) {
  const subject = "Verify your AngeBingo Account";
  
  const text = `Hello ${name || 'Player'},\n\nYour AngeBingo verification code is: ${code}\n\nThis code will expire in 24 hours.`;
  
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; font-weight: 900; margin: 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
          AngeBingo
        </h1>
      </div>
      
      <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 20px; text-align: center;">
        <h2 style="font-size: 22px; font-weight: 700; margin-top: 0; color: #f3f4f6;">Verify your email</h2>
        <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Hi <strong>${name || 'Player'}</strong>, thank you for signing up for AngeBingo! Use the 6-digit verification code below to activate your account.
        </p>
        
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #ec4899; background-color: rgba(236, 72, 153, 0.1); border: 1px dashed rgba(236, 72, 153, 0.3); padding: 15px 30px; border-radius: 12px; display: inline-block; margin: 15px 0;">
          ${code}
        </div>
        
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This code is valid for 24 hours. If you did not sign up for AngeBingo, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #4b5563; font-size: 12px;">
        <p>© 2026 AngeBingo. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
}

/**
 * Send a welcome/notification email when account is successfully verified.
 */
export async function sendWelcomeEmail(email, name) {
  const subject = "Your AngeBingo Account is Verified! 🎉";
  
  const text = `Hello ${name},\n\nCongratulations! Your AngeBingo account has been successfully verified.\n\nYou can now log in, play rooms, join matches, and win exciting prizes.\n\nHappy Daubing!\nThe AngeBingo Team`;
  
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; font-weight: 900; margin: 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
          AngeBingo
        </h1>
      </div>
      
      <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 20px; text-align: center;">
        <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
        <h2 style="font-size: 24px; font-weight: 800; margin-top: 0; color: #f3f4f6; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">Account Verified!</h2>
        
        <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-top: 15px; margin-bottom: 24px;">
          Hi <strong>${name}</strong>, your email has been successfully verified! Your account is now fully active.
        </p>
        
        <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
          Step into the lobby, choose your favorite Bingo room, match the win conditions, and win cash or coins!
        </p>
        
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/lobby" style="text-decoration: none; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: #ffffff; font-weight: bold; font-size: 15px; padding: 14px 35px; border-radius: 30px; display: inline-block; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3); transition: all 0.2s;">
          Go to Game Lobby
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #4b5563; font-size: 12px;">
        <p>If you have any questions, feel free to reply to this email or contact support.</p>
        <p>© 2026 AngeBingo. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
}

/**
 * Send a sign-in notification email.
 */
export async function sendSignInAlertEmail(email, name) {
  const subject = "New Sign-in Detected on AngeBingo 🔐";
  const timeString = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });
  
  const text = `Hello ${name},\n\nWe detected a new sign-in to your AngeBingo account on ${timeString} EAT.\n\nIf this was you, you can ignore this email. If you did not recognize this activity, please secure your account immediately.\n\nThe AngeBingo Team`;
  
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; font-weight: 900; margin: 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
          AngeBingo
        </h1>
      </div>
      
      <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 20px; text-align: center;">
        <div style="font-size: 50px; margin-bottom: 10px;">🔒</div>
        <h2 style="font-size: 22px; font-weight: 700; margin-top: 0; color: #f3f4f6;">New Sign-in Detected</h2>
        
        <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-top: 15px; margin-bottom: 20px; text-align: left;">
          Hi <strong>${name}</strong>,
        </p>
        <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 24px; text-align: left;">
          A new sign-in was detected on your AngeBingo account at <strong>${timeString} EAT</strong>.
        </p>
        
        <div style="background-color: rgba(255, 255, 255, 0.02); padding: 15px; border-radius: 12px; margin-bottom: 24px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.05);">
          <div style="font-size: 13px; color: #9ca3af; margin-bottom: 5px;"><strong>Service:</strong> AngeBingo Web Application</div>
          <div style="font-size: 13px; color: #9ca3af; margin-bottom: 5px;"><strong>Account:</strong> ${email}</div>
          <div style="font-size: 13px; color: #9ca3af;"><strong>Time:</strong> ${timeString} EAT</div>
        </div>
        
        <p style="color: #6b7280; font-size: 13px; text-align: left; line-height: 1.5;">
          If this was you, you can safely disregard this message. If you did not perform this action, please change your password and contact support immediately.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #4b5563; font-size: 12px;">
        <p>© 2026 AngeBingo. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
}
