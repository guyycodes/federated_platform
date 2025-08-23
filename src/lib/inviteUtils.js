// Utility functions for invite token management

/**
 * Generate an invite link for email invitations
 * 
 * @param {string} email - The email address to invite
 * @param {string} baseUrl - The base URL of your application
 * @param {string} token - The invite token (from your backend)
 * @returns {string} The full invite URL
 */
export function generateInviteLink(email, baseUrl, token) {
  const encodedEmail = encodeURIComponent(email);
  return `${baseUrl}/register?invite=${token}&email=${encodedEmail}`;
}

/**
 * Example usage for sending invite emails:
 * 
 * 1. Call your backend to create an invite token:
 *    const response = await fetch('/api/auth/validate-invite', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify({ email: 'user@example.com' })
 *    });
 *    const { inviteUrl } = await response.json();
 * 
 * 2. Include the inviteUrl in your email template:
 *    Subject: You're Invited to BlackCore AI
 *    
 *    Body:
 *    You've been invited to create an account on BlackCore AI's audit automation platform.
 *    
 *    This invitation link will expire in 72 hours.
 *    
 *    Click here to register: {inviteUrl}
 *    
 *    If you have any questions, please contact your administrator.
 * 
 * INVITE URL PATTERN:
 * https://yourdomain.com/register?invite={token}&email={urlEncodedEmail}
 * 
 * Example:
 * https://app.blackcoreai.com/register?invite=eyJhbGciOiJIUzI1NiIs...&email=john.doe%40company.com
 */

// Token validation states
export const INVITE_STATUS = {
  CHECKING: 'checking',
  VALID: 'valid',
  INVALID: 'invalid',
  EXPIRED: 'expired'
};

// Email template for invite (example)
export const getInviteEmailTemplate = (inviteUrl, recipientName = '') => {
  return {
    subject: 'You\'re Invited to BlackCore AI - Audit Automation Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to BlackCore AI</h2>
        
        ${recipientName ? `<p>Hello ${recipientName},</p>` : ''}
        
        <p>You've been invited to create an account on BlackCore AI's audit automation platform.</p>
        
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <strong>Important:</strong> This invitation link will expire in 72 hours.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Accept Invitation & Register
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If the button above doesn't work, copy and paste this link into your browser:
          <br />
          <a href="${inviteUrl}" style="color: #3B82F6; word-break: break-all;">${inviteUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          If you didn't expect this invitation, please ignore this email.
          <br />
          For support, contact your administrator.
        </p>
      </div>
    `,
    text: `
Welcome to BlackCore AI

${recipientName ? `Hello ${recipientName},\n\n` : ''}You've been invited to create an account on BlackCore AI's audit automation platform.

Important: This invitation link will expire in 72 hours.

Click here to accept your invitation and register:
${inviteUrl}

If you didn't expect this invitation, please ignore this email.
For support, contact your administrator.
    `
  };
};
