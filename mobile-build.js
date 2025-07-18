#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building My Excel Platform for Android...\n');

try {
  // Step 1: Build the client
  console.log('1️⃣ Building Next.js client...');
  process.chdir('client');
  execSync('npm run build', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Client built successfully!\n');

  // Step 2: Sync with Capacitor
  console.log('2️⃣ Syncing with Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ Capacitor sync completed!\n');

  // Step 3: Check Android project
  const androidPath = path.join(__dirname, 'android');
  if (fs.existsSync(androidPath)) {
    console.log('3️⃣ Android project ready!');
    console.log('📱 Android project location:', androidPath);
    console.log('✅ You can now open the project in Android Studio!\n');
  } else {
    console.log('❌ Android project not found. Run: npx cap add android');
  }

  // Step 4: Instructions
  console.log('📋 Next steps:');
  console.log('   1. Open Android Studio');
  console.log('   2. Import the "android" folder');
  console.log('   3. Let Gradle sync complete');
  console.log('   4. Click "Run" to build and install on device');
  console.log('\n🎉 Your Excel Platform is ready for Android development!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
