# Dance Recognizer - Deployment Guide

This guide will help you deploy the Dance Recognizer app live on the internet.

## Option 1: Vercel (Easiest - Recommended)

Vercel is the easiest way to deploy React apps. Free tier includes 3 deployments/month.

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial Dance Recognizer commit"
git branch -M main

# Create a repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/dance-recognizer.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Select your `dance-recognizer` repository
5. Click "Import"
6. Leave settings as default, click "Deploy"

### Step 3: Add Environment Variables

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_DATABASE_URL
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_SPOTIFY_CLIENT_ID
   VITE_SPOTIFY_CLIENT_SECRET
   VITE_SPOTIFY_REDIRECT_URI=https://YOUR_VERCEL_URL/callback
   ```

4. Redeploy by pushing a new commit (or click Redeploy)

### Step 4: Update Spotify Redirect URI

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Edit Settings
4. Update Redirect URIs:
   ```
   https://your-app-name.vercel.app/callback
   ```
5. Save

✅ **Your app is now live!**

---

## Option 2: Firebase Hosting

Alternative to Vercel. Good if you want everything in one Firebase project.

### Step 1: Install Firebase Tools

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase

```bash
firebase init hosting
# Choose your Firebase project
# Enter "dist" for public directory
# Don't overwrite index.html
```

### Step 3: Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

Your app will be at: `https://YOUR_PROJECT_ID.web.app`

### Step 4: Update Spotify Redirect URI

Update your Spotify app to accept:
```
https://YOUR_PROJECT_ID.web.app/callback
```

---

## Option 3: Manual Server Deployment

For advanced users with a server.

### Using Node/Express

```bash
npm run build
npm install express cors
# Create server.js and serve dist/ folder
```

### Using Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run", "preview"]
```

---

## Post-Deployment Checklist

After deploying, verify everything works:

- [ ] Login works (Firebase Auth)
- [ ] Can sign up with email
- [ ] Spotify OAuth redirects properly
- [ ] Songs load from playlists
- [ ] Can rate songs
- [ ] Ratings save to Firebase
- [ ] Progress bar updates
- [ ] Points & streak counter work
- [ ] Achievements trigger correctly

## Monitoring

### Firebase Console

Monitor in real-time:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Check Realtime Database for ratings
4. Monitor Authentication for users

### Check Logs

```bash
# Vercel
vercel logs

# Firebase
firebase functions:log
```

## Troubleshooting

### Songs not loading after deployment

**Issue**: Spotify API returns 403 error
**Solution**: 
- Verify VITE_SPOTIFY_CLIENT_ID is set in environment variables
- Check Redirect URI matches exactly (including protocol)
- Make sure playlist IDs are still valid

### Ratings not saving

**Issue**: Firebase writes fail
**Solution**:
- Check database rules in Firebase Console
- Verify VITE_FIREBASE_DATABASE_URL is correct
- Ensure user is authenticated before saving

### Environment variables not loading

**Issue**: App shows "YOUR_API_KEY" instead of actual key
**Solution**:
- Variables must start with `VITE_` for Vite to expose them
- Restart dev server after adding .env variables
- In production (Vercel/Firebase), restart deployment

## Updating the App

After making changes:

```bash
# For Vercel
git push  # Auto-deploys via GitHub

# For Firebase
npm run build
firebase deploy
```

## Custom Domain

### Vercel
1. Go to project Settings → Domains
2. Add your domain (e.g., rate-dance.hochzeitstanz.wien)
3. Follow DNS setup instructions

### Firebase Hosting
1. Go to Hosting → Custom Domain
2. Add your domain
3. Follow verification steps

---

## Questions?

Check the main [README.md](./README.md) for more details.
