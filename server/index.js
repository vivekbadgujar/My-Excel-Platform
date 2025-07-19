require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();

// CORS configuration - Allow all origins for now
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// MongoDB connection for serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const User = require('./models/User');

// Schema for storing verification codes in database
const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiry: { type: Date, required: true },
  verified: { type: Boolean, default: false }
});

// Auto-delete expired codes
VerificationCodeSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Import nodemailer
const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Excel Platform - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">Excel Platform</h1>
              <h2 style="color: #374151; margin-bottom: 20px;">Email Verification</h2>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #6b7280; font-size: 16px; margin-bottom: 20px;">Thank you for signing up! Please use the verification code below to complete your registration:</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;">
                  ${verificationCode}
                </div>
              </div>
              
              <p style="color: #ef4444; font-size: 14px; margin-top: 15px;">This code will expire in 15 minutes.</p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin-bottom: 5px;">If you didn't request this verification, please ignore this email.</p>
              <p style="color: #9ca3af; font-size: 12px;">© 2024 Excel Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Send verification code endpoint
app.post('/api/auth/send-verification', async (req, res) => {
  const { email } = req.body;
  try {
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store verification code in database (upsert to handle duplicates)
    await VerificationCode.findOneAndUpdate(
      { email },
      {
        code: verificationCode,
        expiry: expiryTime,
        verified: false
      },
      { upsert: true, new: true }
    );

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    if (emailSent) {
      console.log(`Verification email sent successfully to ${email}`);
      res.json({ 
        message: 'Verification code sent to your email successfully!'
      });
    } else {
      console.error(`Failed to send verification email to ${email}`);
      // Still log the code for backup in case email fails
      console.log(`Backup - Verification code for ${email}: ${verificationCode}`);
      res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.'
      });
    }
  } catch (err) {
    console.error('Send verification error:', err);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
});

// Verify code endpoint
app.post('/api/auth/verify-code', async (req, res) => {
  const { email, code } = req.body;
  try {
    await connectToDatabase();
    
    // Check if verification code exists and is valid
    const storedData = await VerificationCode.findOne({ email });
    if (!storedData) {
      return res.status(400).json({ message: 'No verification code found for this email' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > storedData.expiry) {
      await VerificationCode.deleteOne({ email });
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Mark as verified
    await VerificationCode.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify code error:', err);
    res.status(500).json({ message: 'Failed to verify code' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, verificationCode } = req.body;
  try {
    await connectToDatabase();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if verification was completed
    const storedData = await VerificationCode.findOne({ email });
    if (!storedData || !storedData.verified) {
      return res.status(400).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    console.log('User saved:', user);
    
    // Clean up verification code
    await VerificationCode.deleteOne({ email });
    
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, email: user.email, role: user.role });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token generated:', token); // Debug log
    res.json({ token, email: user.email, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received token for profile:', token); // Debug log
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ userId: user._id, email: user.email, role: user.role });
  } catch (err) {
    console.error('Profile error:', err);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    console.log("Upload request received:", req.file); // Debug log
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: 'File uploaded', filename: req.file?.filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload error' });
  }
});

// Export the app for Vercel
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
