const axios = require('axios');

// Test the API endpoints
async function testAPI() {
  console.log('Testing API endpoints...\n');
  
  // Test 1: Health check
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('✅ Health check:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Send verification code
  try {
    const response = await axios.post('http://localhost:5000/api/auth/send-verification', {
      email: 'test@example.com'
    });
    console.log('✅ Send verification:', response.data);
  } catch (error) {
    console.log('❌ Send verification failed:', error.response?.data || error.message);
  }
  
  // Test 3: Login endpoint
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'testpass'
    });
    console.log('✅ Login test:', response.data);
  } catch (error) {
    console.log('❌ Login test failed:', error.response?.data || error.message);
  }
}

testAPI();
