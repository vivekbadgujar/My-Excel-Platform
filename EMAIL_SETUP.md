# Email Setup Instructions

## To enable real email verification, follow these steps:

### 1. Gmail Account Setup
1. Go to your Gmail account
2. Click on your profile picture → "Manage your Google Account"
3. Go to "Security" tab
4. Enable "2-Step Verification" if not already enabled
5. After enabling 2-Step Verification, go to "App passwords"
6. Generate a new App Password for "Mail"
7. Copy the 16-character password

### 2. Update Environment Variables
Open `server/.env` file and update:
```
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 3. Alternative Email Services
If you don't want to use Gmail, you can modify the transporter in `server/index.js`:

#### For Outlook/Hotmail:
```javascript
service: 'outlook'
```

#### For Yahoo:
```javascript
service: 'yahoo'
```

#### For custom SMTP:
```javascript
host: 'smtp.yourprovider.com',
port: 587,
secure: false,
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
```

### 4. Testing
1. Start the server: `npm run dev`
2. Try signing up with a real email address
3. Check your email inbox for the verification code
4. If emails fail, check server console for backup codes

## Security Notes
- Never commit your actual email credentials to GitHub
- Use App Passwords, not your regular Gmail password
- The .env file is already in .gitignore to prevent accidental commits
