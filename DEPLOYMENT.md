# Deployment Guide

## Vercel Deployment

### Prerequisites
1. MongoDB Atlas database
2. Gmail account with app password for email verification
3. Vercel account

### Environment Variables
Set these environment variables in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

### Deployment Steps

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Set Environment Variables:**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all the required environment variables

4. **Deploy:**
   - Vercel will automatically build and deploy your application
   - Your frontend will be available at the main domain
   - Your API will be available at `/api/*` routes

### Project Structure
- `client/` - Next.js frontend
- `server/` - Express.js backend API
- `vercel.json` - Vercel configuration

### API Endpoints
- `GET /api/` - Health check
- `POST /api/auth/send-verification` - Send verification code
- `POST /api/auth/verify-code` - Verify email code
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/upload` - File upload

### Troubleshooting

1. **Build Errors:**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly installed

2. **Database Connection:**
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas IP whitelist

3. **Email Issues:**
   - Verify Gmail app password is correct
   - Check if 2FA is enabled and app password is generated

4. **API Routes:**
   - All API routes are prefixed with `/api/`
   - Check Vercel function logs for errors
