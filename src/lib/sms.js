/**
 * Generic function to send SMS notifications.
 * Logs to console during development. Can be easily extended to integrate with Twilio, Infobip, or Telebirr SMS APIs.
 */
export async function sendSMS({ to, message }) {
  if (!to) {
    console.warn("[SMS Warning] No phone number provided.");
    return { success: false, error: "No phone number" };
  }

  // Print to console in a clean visual block
  console.log('\n=== [SMS FALLBACK LOG] ===');
  console.log(`To:      ${to}`);
  console.log(`Content: ${message}`);
  console.log('==========================\n');

  return { success: true };
}

/**
 * Send a verification code to a user's phone.
 */
export async function sendVerificationSMS(phone, name, code) {
  const message = `Hello ${name || 'Player'}, your AngeBingo verification code is: ${code}. Valid for 24 hours.`;
  return sendSMS({ to: phone, message });
}

/**
 * Send a sign-in alert SMS to a user's phone.
 */
export async function sendSignInAlertSMS(phone, name) {
  const timeString = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });
  const message = `Hello ${name || 'Player'}, a new sign-in was detected on your AngeBingo account on ${timeString} EAT.`;
  return sendSMS({ to: phone, message });
}

/**
 * Send a welcome SMS to a user's phone.
 */
export async function sendWelcomeSMS(phone, name) {
  const message = `Welcome to AngeBingo, ${name || 'Player'}! Your account is now active. Log in to start playing!`;
  return sendSMS({ to: phone, message });
}
