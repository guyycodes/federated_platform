#!/usr/bin/env node

import { PrismaClient } from '../vite/generated/prisma/index.js';
import { Clerk } from '@clerk/clerk-sdk-node';
import readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Display menu
const displayMenu = () => {
  console.log('\n=== SUPER ADMIN TOOL ===');
  console.log('1. List Users');
  console.log('2. Add User to clerk & database (requires email, phone, username)');
  console.log('3. Delete User');
  console.log('4. Check Email in Clerk');
  console.log('5. Exit');
  console.log('========================\n');
};

// List all users
const listUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        clerkUserId: true,
        isActive: true
      }
    });
    
    console.log('\n=== USERS ===');
    for (const u of users) {
      console.log(`ID: ${u.id}`);
      console.log(`  Name: ${u.firstName} ${u.lastName}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Role: ${u.role}`);
      console.log(`  Active: ${u.isActive}`);
      
      // Check if user exists in Clerk
      let clerkStatus = '❌ Not in Clerk';
      try {
        const clerkUser = await clerk.users.getUser(u.clerkUserId);
        if (clerkUser) {
          clerkStatus = '✅ In Clerk';
        }
      } catch (err) {
        // User not found in Clerk
      }
      console.log(`  Clerk Status: ${clerkStatus}`);
      console.log('---');
    }
  } catch (error) {
    console.error('Error listing users:', error.message);
  }
};

// Add new user
const addUser = async () => {
  let clerkUser = null;
  
  try {
    const email = await ask('Email: ');
    const password = await ask('Password: ');
    const firstName = await ask('First Name: ');
    const lastName = await ask('Last Name: ');
    const phone = await ask('Phone Number: ');
    console.log('\nRoles: USER_ADMIN, USER, LOCATION_ADMIN');
    const role = await ask('Role: ');
    
    // Generate username from email (morgbeals@gmail.com -> morgbeals_gmailcom)
    const username = email.replace('@', '_').replace(/\./g, '');
    
    console.log(`\n📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔄 Creating user in Clerk...\n`);
    
    // Create in Clerk
    try {
      clerkUser = await clerk.users.createUser({
        emailAddress: [email],
        phoneNumber: [phone],
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
      });
      console.log('✅ User created in Clerk successfully!');
      console.log(`   Clerk ID: ${clerkUser.id}`);
    } catch (clerkError) {
      console.error('❌ Error creating user in Clerk:');
      console.error('   Status:', clerkError.status);
      console.error('   Message:', clerkError.message);
      console.error('   Full error:', JSON.stringify(clerkError, null, 2));
      
      // If Clerk creation fails, don't proceed to database
      return;
    }
    
    console.log('\n🔄 Creating user in database...');
    
    // Create in database
    try {
      const dbUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          clerkUserId: clerkUser.id,
          role: role.toUpperCase()
        }
      });
      
      console.log('✅ User created in database successfully!');
      console.log(`   Database ID: ${dbUser.id}`);
      console.log(`   Role: ${dbUser.role}`);
      console.log(`   Phone: ${dbUser.phone}`);
    } catch (dbError) {
      console.error('❌ Error creating user in database:');
      console.error('   Code:', dbError.code);
      console.error('   Message:', dbError.message);
      console.error('   Full error:', JSON.stringify(dbError, null, 2));
      
      // If database creation fails, clean up Clerk user
      if (clerkUser) {
        console.log('\n🔄 Cleaning up Clerk user...');
        try {
          await clerk.users.deleteUser(clerkUser.id);
          console.log('✅ Clerk user cleaned up successfully');
        } catch (cleanupError) {
          console.error('❌ Error cleaning up Clerk user:', cleanupError.message);
          console.error('   You may need to manually delete user with ID:', clerkUser.id);
        }
      }
      return;
    }
    
    console.log('\n✅ User created successfully in both Clerk and database!');
    
  } catch (error) {
    console.error('❌ Unexpected error during user creation:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Full error:', JSON.stringify(error, null, 2));
  }
};

// Delete user
const deleteUser = async () => {
  try {
    await listUsers();
    const id = await ask('\nEnter user ID to delete: ');
    
    // Get user from database
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    const confirm = await ask(`Delete ${user.email}? (yes/no): `);
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Cancelled.');
      return;
    }
    
    // Try to delete from Clerk (but continue if not found)
    try {
      await clerk.users.deleteUser(user.clerkUserId);
      console.log('✅ Deleted from Clerk');
    } catch (clerkError) {
      if (clerkError.message.includes('Not Found')) {
        console.log('⚠️  User not found in Clerk (continuing with database deletion)');
      } else {
        console.log('⚠️  Error deleting from Clerk:', clerkError.message);
      }
    }
    
    // Delete from database
    await prisma.user.delete({ where: { id } });
    
    console.log('✅ User deleted successfully from database!');
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  }
};

// Check if email exists in Clerk
const checkEmailInClerk = async () => {
  try {
    const email = await ask('\nEnter email to check: ');
    
    const users = await clerk.users.getUserList({ emailAddress: [email] });
    
    if (users.length > 0) {
      console.log('\n✅ User found in Clerk!');
      const user = users[0];
      console.log(`  Clerk ID: ${user.id}`);
      console.log(`  Name: ${user.firstName} ${user.lastName}`);
      console.log(`  Email: ${user.emailAddresses[0]?.emailAddress}`);
      console.log(`  Created: ${new Date(user.createdAt).toLocaleString()}`);
    } else {
      console.log('\n❌ Email not found in Clerk.');
    }
  } catch (error) {
    console.error('❌ Error checking email:', error.message);
  }
};

// Main function
const main = async () => {
  console.log('\n🔐 SUPER ADMIN TOOL');
  const accessCode = await ask('Access code: ');
  
  if (accessCode !== '123456') {
    console.log('❌ Invalid access code!');
    rl.close();
    await prisma.$disconnect();
    return;
  }
  
  console.log('✅ Access granted!\n');
  
  let running = true;
  while (running) {
    displayMenu();
    const choice = await ask('Choice: ');
    
    switch (choice) {
      case '1':
        await listUsers();
        break;
      case '2':
        await addUser();
        break;
      case '3':
        await deleteUser();
        break;
      case '4':
        await checkEmailInClerk();
        break;
      case '5':
        running = false;
        break;
      default:
        console.log('Invalid choice!');
    }
  }
  
  console.log('\nGoodbye!');
  rl.close();
  await prisma.$disconnect();
};

// Run the tool
main().catch((e) => {
  console.error('Error:', e);
  rl.close();
  prisma.$disconnect();
}); 