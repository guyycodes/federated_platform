# Invite-Only Registration System

## Overview
The BlackCore AI platform uses an invite-only registration system where new users can only register through a time-limited invitation link sent via email.

## How It Works

### 1. Generating Invite Links
To invite a new user, make a POST request to the invite endpoint:

```bash
POST /api/auth/validate-invite
Content-Type: application/json

{
  "email": "user@example.com",
  "expiresInHours": 72  // Optional, defaults to 72 hours
}
```

Response:
```json
{
  "success": true,
  "inviteUrl": "https://app.blackcoreai.com/register?invite=eyJhbGc...&email=user%40example.com",
  "expiresAt": "2024-01-23T12:00:00Z",
  "message": "Invite link created successfully"
}
```

### 2. Invite URL Pattern
The invite URL follows this pattern:
```
https://yourdomain.com/register?invite={token}&email={urlEncodedEmail}
```

Example:
```
https://app.blackcoreai.com/register?invite=eyJhbGciOiJIUzI1NiIs...&email=john.doe%40company.com
```

### 3. Email Template
Use the provided email template from `src/lib/inviteUtils.js`:

```javascript
import { getInviteEmailTemplate } from '@/lib/inviteUtils';

const emailTemplate = getInviteEmailTemplate(inviteUrl, recipientName);
// Send emailTemplate.subject and emailTemplate.html/text via your email service
```

### 4. Registration Flow

1. **User clicks invite link** → Registration page opens
2. **Token validation** → System checks if token is valid and not expired
3. **Valid token** → Registration form appears with email pre-filled and locked
4. **Invalid/Expired token** → Error message displayed

### 5. Token Validation States

- **Checking**: Validating the invitation...
- **Valid**: Registration form is shown
- **Invalid**: "Invalid Invitation Link" error
- **Expired**: "Invitation Link Expired" error (after 72 hours)

## Security Features

1. **Time-limited tokens**: All invites expire after 72 hours
2. **Email locking**: Invited email address cannot be changed during registration
3. **Token tracking**: System tracks which invitation was used for each registration
4. **One-time use**: Tokens should be invalidated after successful registration (implement in production)

## Implementation Notes

### Backend Requirements
In production, implement:
- Secure token generation (JWT or UUID)
- Database storage for tokens with expiration
- Token invalidation after use
- Admin authentication for creating invites
- Rate limiting for invite creation

### Frontend Features
- Pre-filled, read-only email field
- Visual indication of invitation status
- Clear error messages for invalid/expired tokens
- Smooth loading states during validation

## Example Admin Interface
```javascript
// Simple admin function to invite users
async function inviteUser(email) {
  const response = await fetch('/api/auth/validate-invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}` // Add admin auth
    },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  
  // Send email with data.inviteUrl
  await sendInvitationEmail(email, data.inviteUrl);
}
```

## Testing
1. Generate an invite link using the POST endpoint
2. Visit the link in a browser
3. Verify email is pre-filled and locked
4. Complete registration
5. Try using the same link again (should fail in production)

## Troubleshooting

**"Invalid Invitation Link"**
- Check token is included in URL
- Verify token format is correct
- Ensure backend validation endpoint is working

**"Invitation Link Expired"**
- Token is older than 72 hours
- Generate a new invitation

**Email not pre-filled**
- Check email parameter in URL is properly encoded
- Verify email parameter is included in invite link
