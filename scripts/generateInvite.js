#!/usr/bin/env node

/**
 * Script to generate invite links for new users
 * Usage: node scripts/generateInvite.js user@example.com
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function generateInvite(email) {
  if (!email) {
    console.error('❌ Email address is required');
    console.log('Usage: node scripts/generateInvite.js user@example.com');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Invalid email format');
    process.exit(1);
  }

  console.log(`\n🔄 Generating invite for: ${email}`);

  try {
    const response = await fetch(`${BASE_URL}/api/auth/validate-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add admin authentication header
        // 'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        email,
        expiresInHours: 72
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to generate invite: ${error}`);
    }

    const data = await response.json();

    console.log('\n✅ Invite generated successfully!\n');
    console.log('📧 Email:', email);
    console.log('🔗 Invite URL:', data.inviteUrl);
    console.log('⏰ Expires at:', new Date(data.expiresAt).toLocaleString());
    console.log('\n📋 Copy this link and send it to the user:');
    console.log(data.inviteUrl);
    console.log('\n💡 Tip: The user must use this link within 72 hours');

    // Optionally copy to clipboard (macOS)
    if (process.platform === 'darwin') {
      const { exec } = require('child_process');
      exec(`echo "${data.inviteUrl}" | pbcopy`, (error) => {
        if (!error) {
          console.log('\n📋 Link copied to clipboard!');
        }
      });
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
generateInvite(email);

/**
 * Example usage:
 * 
 * 1. Generate invite for a single user:
 *    node scripts/generateInvite.js john.doe@company.com
 * 
 * 2. Generate invites for multiple users (bash):
 *    for email in user1@example.com user2@example.com; do
 *      node scripts/generateInvite.js $email
 *    done
 * 
 * 3. Generate from a CSV file:
 *    cat emails.csv | while read email; do
 *      node scripts/generateInvite.js $email
 *    done
 */
