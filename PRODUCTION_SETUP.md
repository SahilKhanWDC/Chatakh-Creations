# 🚀 Production Deployment - Complete Setup Guide

## Your Current Deployment
- **Frontend**: Vercel (chatakh-creations.vercel.app)
- **Backend**: Render (chatakh-creations.onrender.com)
- **Database**: ❌ POINTING TO LOCALHOST (THIS IS THE PROBLEM)

---

## ⚠️ CRITICAL ISSUE: MongoDB is localhost!

Your backend `.env` has:
```
MONGO_URI=mongodb://localhost:27017/
```

**This doesn't work on Render because:**
- Render container doesn't have local MongoDB
- Each time Render restarts, it's a fresh container
- You need a cloud MongoDB like MongoDB Atlas

---

## ✅ STEP 1: Set Up MongoDB Atlas (Cloud Database)

### 1. Go to https://www.mongodb.com/cloud/atlas
### 2. Create Free Account & Cluster
- Click "Create a free account"
- Verify email
- Create organization
- Create a project
- Create a cluster (Free tier)
- Wait ~3-5 minutes for cluster to deploy

### 3. Create Database User
- Go to Security → Database Access
- Click "Add New Database User"
- Username: `shikharuser` (or your choice)
- Password: Create strong password (save it!)
- Built-in Role: "Atlas Admin"
- Click "Create User"

### 4. Get Connection String
- Go to Databases
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy MongoDB URI
- Replace `<password>` with your actual password
- It will look like:
```
mongodb+srv://shikharuser:YOUR_PASSWORD@cluster.mongodb.net/shikharclothing?retryWrites=true&w=majority
```

### 5. Whitelist IPs
- In Security → Network Access
- Add IP Address: `0.0.0.0/0` (Allow from anywhere)
- Click "Confirm"

---

## ✅ STEP 2: Set Up Clerk Production Keys

### For Production (Vercel Deployment)
1. Go to https://dashboard.clerk.com
2. Click your application
3. Go to API Keys
4. Look for **"pk_live_"** (production key) and **"sk_live_"** (production secret)
5. If not available, you may still be in development mode
   - Go to Settings → API Version
   - You should see both test and live keys once deployed

### For Now (Keep using test keys while testing):
- Test keys starting with `pk_test_` are fine for development
- Switch to `pk_live_` keys once fully deployed and tested

---

## ✅ STEP 3: Update Backend .env on Render

Go to your Render dashboard:
1. Select your backend service
2. Go to "Environment"
3. Update these variables:

```env
PORT=5000

# MONGODB - USE YOUR ATLAS CONNECTION STRING
MONGO_URI=mongodb+srv://shikharuser:YOUR_PASSWORD@cluster.mongodb.net/shikharclothing?retryWrites=true&w=majority

# JWT
JWT_SECRET=supersecretjwt

# RAZORPAY (keep your test keys for now)
RAZORPAY_KEY_ID=rzp_test_RukjsMfHLtFTPs
RAZORPAY_KEY_SECRET=Kh7t9Qw6xYwaSSzo10QjNOqR

# CLOUDINARY - Get these from dashboard.cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=MJcjW-wvpVWTCY51gKYAhbUBqyw

# CLERK - Use production keys when available
CLERK_PUBLISHABLE_KEY=pk_test_Y2hhcm1pbmctZ2F0b3ItMi5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_AxDX37O77YFpMslHOtffF637DNZbufiZjnLyDQ1U2K
```

4. Click "Save" and Render will auto-restart the service

---

## ✅ STEP 4: Update Frontend .env on Vercel

I already updated your local `.env` to:
```
VITE_API_URL=https://chatakh-creations.onrender.com
VITE_RAZORPAY_KEY=rzp_test_RukjsMfHLtFTPs
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2hhcm1pbmctZ2F0b3ItMi5jbGVyay5hY2NvdW50cy5kZXYk
```

Now push this to your Git repo and Vercel will auto-deploy:

```bash
git add frontend/.env
git commit -m "Fix: Update API URL for production"
git push
```

---

## ✅ STEP 5: Get Cloudinary Credentials

1. Go to https://dashboard.cloudinary.com
2. Copy from Dashboard:
   - **CLOUDINARY_CLOUD_NAME** (under "Cloud name")
   - **CLOUDINARY_API_KEY** (under "API Key")
   - **CLOUDINARY_API_SECRET** (under "API Secret")

3. Update backend .env on Render with these values

---

## 🧪 Testing After Setup

After updating all environment variables:

1. **Wait 2-3 minutes** for Render to restart
2. Go to https://chatakh-creations.vercel.app
3. Login with your Clerk account (ensure user has admin role)
4. Check Browser Console for errors
5. Try uploading a product:
   - Select images
   - Fill form (name, price, stock, category)
   - Click "Add Product"

### If still getting errors:
1. Open DevTools Console (F12)
2. Check for specific error messages
3. Verify MongoDB Atlas connection works
4. Check Cloudinary credentials

---

## 🔐 Production Checklist

- [ ] MongoDB URI updated to Atlas connection string
- [ ] Cloudinary credentials added to backend .env
- [ ] Frontend .env has correct API URL
- [ ] Backend .env updated on Render
- [ ] Frontend committed and deployed to Vercel
- [ ] Clerk admin role set on your user
- [ ] CORS allows Vercel domain on backend
- [ ] All environment variables set without typos
- [ ] Render service restarted (should happen auto)
- [ ] Tested admin dashboard login
- [ ] Tested product creation with image upload

---

## 📝 Quick Reference

**MongoDB Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Common Ports:**
- Render backend: https://chatakh-creations.onrender.com
- Vercel frontend: https://chatakh-creations.vercel.app
- Local backend: http://localhost:5000
- Local frontend: http://localhost:5173

**Push changes with:**
```bash
git add .
git commit -m "Update production environment variables"
git push
```

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- ✓ Check MongoDB URI is correct
- ✓ Verify password has no special characters (or URL encoded)
- ✓ Check IP whitelist includes 0.0.0.0/0

### "Image upload fails"
- ✓ Verify Cloudinary credentials in .env
- ✓ Check API Secret is exactly correct

### "API calls return 404"
- ✓ Verify CORS allowedOrigins includes your Vercel URL
- ✓ Check API base URL in frontend .env

### "Login doesn't work"
- ✓ Verify Clerk keys are correct
- ✓ Check user has admin role in Clerk dashboard

---

This should permanently fix all your production issues! 🎉
