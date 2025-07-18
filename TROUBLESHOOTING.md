# Troubleshooting Guide

## 🔧 **Email Verification Error Fixed**

### **Issue**: "Failed to send verification code: Network or unknown error"

### **Root Cause**: 
The frontend was hardcoded to use `http://localhost:5000` which doesn't exist in production.

### **Solution Applied**:
✅ **API Configuration Fix**: 
- Created `client/src/lib/api.ts` with dynamic API routing
- Updated all API calls to use proper URLs
- Production: Uses same domain with `/api` prefix
- Development: Uses `http://localhost:5000`

### **What Was Changed**:
1. **Frontend API Calls**: All hardcoded URLs replaced with dynamic routing
2. **Authentication**: Fixed token storage (now uses `authToken`)
3. **Error Handling**: Improved error messages and logging
4. **Environment Detection**: Automatic production vs development detection

---

## 🚀 **Deployment Status**

### **Current Setup**:
- ✅ **Frontend**: Next.js deployed on Vercel
- ✅ **Backend**: Express.js configured for Vercel Functions
- ✅ **API Routing**: Dynamic URL resolution
- ✅ **Authentication**: JWT-based with proper token handling

### **Environment Variables Needed**:
Add these to your Vercel project:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

---

## 📱 **Android App Status**

### **Mobile App Ready**:
- ✅ **Native Android**: Capacitor configured
- ✅ **API Integration**: Same API routes work in mobile
- ✅ **Build Ready**: `npm run build:android`
- ✅ **Android Studio**: Project ready to open

---

## 🔍 **Testing Your Deployment**

### **Test Sequence**:
1. **Frontend**: Visit your Vercel URL
2. **Signup Flow**: 
   - Enter email → Should get verification code
   - Check email for code
   - Enter code → Should proceed to password step
   - Complete signup → Should redirect to login
3. **Login**: Use created credentials
4. **Dashboard**: Should access main app

### **If Still Having Issues**:

#### **Check Vercel Function Logs**:
1. Go to Vercel Dashboard → Your Project
2. Functions tab → View logs
3. Look for API request errors

#### **Check Environment Variables**:
1. Vercel Dashboard → Settings → Environment Variables
2. Ensure all required variables are set
3. Redeploy if you added new variables

#### **Test API Endpoints Directly**:
```bash
# Test if API is accessible
curl https://your-vercel-url.com/api/auth/send-verification \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 🛠️ **Common Issues & Solutions**

### **1. Email Not Sending**
```
Error: "Failed to send verification code"
```
**Solution**: 
- Check Gmail app password is correct
- Verify 2FA is enabled in Gmail
- Check EMAIL_USER and EMAIL_PASS in Vercel environment

### **2. MongoDB Connection Error**
```
Error: "MongoDB connection error"
```
**Solution**:
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Ensure database user has read/write permissions

### **3. JWT Token Error**
```
Error: "Invalid or expired token"
```
**Solution**:
- Check JWT_SECRET is set in environment
- Clear browser localStorage and try again
- Verify token is being passed in requests

### **4. API Route Not Found**
```
Error: "404 Not Found"
```
**Solution**:
- Check Vercel function deployment
- Verify vercel.json routing configuration
- Ensure server/index.js is properly exported

---

## 📞 **Support**

If you're still experiencing issues:

1. **Check Vercel Logs**: Look for specific error messages
2. **Browser Console**: Check for network errors
3. **Email Setup**: Verify Gmail app password
4. **Database**: Test MongoDB connection
5. **Environment**: Ensure all variables are set

---

## 🎉 **Success Indicators**

Your deployment is working when:
- ✅ Signup sends verification emails
- ✅ Email verification works
- ✅ User registration completes
- ✅ Login works with created account
- ✅ Dashboard is accessible
- ✅ Android app builds and runs

**Your Excel Platform is now fully deployed and ready for production use!**
