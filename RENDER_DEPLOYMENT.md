# Deploying ValueFlow to Render

This guide will help you deploy your ValueFlow ACT Therapy app to Render.

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (free tier available)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
4. Whitelist all IP addresses:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
5. Get your connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/valueflow?retryWrites=true&w=majority`

## Step 2: Prepare Your Repository

1. Make sure all your code is committed and pushed to GitHub/GitLab/Bitbucket
2. Ensure these files are in your repository:
   - `render.yaml` (already created)
   - `package.json` with `start` script (already updated)
   - `.gitignore` with `.env` listed

## Step 3: Deploy to Render

### Option A: Using render.yaml (Blueprint - Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your Git repository
4. Render will automatically detect `render.yaml`
5. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secret string (e.g., generate with `openssl rand -base64 32`)
6. Click "Apply" to create the service

### Option B: Manual Setup

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `valueflow-app` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Runtime**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:
     ```
     NODE_ENV=production
     MONGODB_URI=<your-mongodb-atlas-connection-string>
     JWT_SECRET=<your-random-secret-key>
     PORT=10000
     ```

6. Click "Create Web Service"

## Step 4: Wait for Deployment

- Render will build and deploy your app (takes 5-10 minutes)
- Watch the logs for any errors
- Once deployed, you'll get a URL like: `https://valueflow-app.onrender.com`

## Step 5: Test Your Deployment

1. Visit your Render URL
2. Try registering a new account
3. Test the features:
   - Home page (public)
   - Learn page (public)
   - Login/Register
   - Values, Habits, Daily, Weekly (protected)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/valueflow` |
| `JWT_SECRET` | Secret for JWT tokens | `your-random-secret-key-here` |
| `PORT` | Port number (Render uses 10000) | `10000` |

## Troubleshooting

### Build Fails

**Issue**: "Cannot find module" errors
- **Solution**: Make sure all dependencies are in `package.json` (not just devDependencies)

**Issue**: Build timeout
- **Solution**: The free tier has limited resources. Try again or upgrade to paid tier.

### App Crashes on Start

**Issue**: MongoDB connection fails
- **Solution**:
  - Verify your `MONGODB_URI` is correct
  - Ensure you whitelisted all IPs in MongoDB Atlas
  - Check the password doesn't contain special characters that need URL encoding

**Issue**: "JWT_SECRET is not defined"
- **Solution**: Add `JWT_SECRET` environment variable in Render dashboard

### App Deploys but Features Don't Work

**Issue**: Authentication fails
- **Solution**: Check browser console for CORS errors. Verify environment variables are set.

**Issue**: Pages won't load
- **Solution**: Check that the build command created `client/dist` folder with your React build

## Free Tier Limitations

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- Consider using a service like [UptimeRobot](https://uptimerobot.com/) to ping your app every 14 minutes

## Updating Your App

1. Push changes to your Git repository
2. Render automatically detects changes and redeploys
3. Manual deploy: Go to Render Dashboard → Your Service → "Manual Deploy" → "Deploy latest commit"

## Custom Domain (Optional)

1. Go to your service in Render
2. Click "Settings" → "Custom Domain"
3. Add your domain and follow DNS instructions
4. SSL certificate is automatically provided

## Need Help?

- Check [Render Documentation](https://render.com/docs)
- Check Render deployment logs in the dashboard
- Look for errors in the "Events" and "Logs" tabs

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Code pushed to Git repository
- [ ] Render service created
- [ ] Environment variables set (MONGODB_URI, JWT_SECRET)
- [ ] Deployment successful
- [ ] App tested and working

🎉 Your ValueFlow app is now live!
