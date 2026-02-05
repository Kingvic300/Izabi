#!/usr/bin/env node

/**
 * Standalone Admin User Creation Script for Izabi
 * Run with: node create-admin.js
 */

const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const readline = require('readline');

// MongoDB connection URI - Update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kingvic300:victor123@cluster0.ot4ik.mongodb.net/izabi_db?retryWrites=true&w=majority';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

async function createAdmin() {
  console.log('\n🔐 Izabi Admin User Creation Script\n');
  
  let client;
  
  try {
    // Get admin credentials
    console.log('📝 Please provide admin credentials:\n');
    
    const email = await question('Email address: ');
    const password = await question('Password (min 6 chars, 1 uppercase, 1 number): ');
    const firstName = await question('First Name (optional, press Enter to skip): ') || 'Admin';
    const lastName = await question('Last Name (optional, press Enter to skip): ') || 'User';

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\n❌ Invalid email format!');
      process.exit(1);
    }

    // Validate password
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      console.error('\n❌ Password must be at least 6 characters with 1 uppercase letter and 1 number!');
      process.exit(1);
    }

    console.log('\n⏳ Connecting to database...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('izabi_db');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.error('\n❌ User with this email already exists!');
      console.log(`   Found: ${existingUser.email} (Role: ${existingUser.role || 'USER'})`);
      process.exit(1);
    }

    console.log('🔒 Hashing password...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user object
    const adminUser = {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      firstName,
      lastName,
      isVerified: true, // Skip OTP verification for admin
      points: 0,
      dailyPoints: 0,
      streak: 0,
      studyStats: { 
        summaries: 0, 
        quizzes: 0, 
        guides: 0, 
        flashcards: 0 
      },
      pet: { 
        name: 'Izabi Pet', 
        type: 'owl', 
        level: 1, 
        mood: 'happy' 
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💾 Creating admin user...');
    
    // Insert admin user
    const result = await usersCollection.insertOne(adminUser);

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   ID: ${result.insertedId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Role: ADMIN`);
    console.log(`   Status: Verified`);
    console.log('\n🎉 You can now login at: https://izabi.onrender.com/login\n');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    if (error.code === 'ENOTFOUND' || error.name === 'MongoNetworkError') {
      console.error('   Make sure your MongoDB connection string is correct.');
    }
    process.exit(1);
  } finally {
    rl.close();
    if (client) {
      await client.close();
    }
  }
}

// Run the script
createAdmin();
