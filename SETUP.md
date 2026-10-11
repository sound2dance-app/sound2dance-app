# Dance Recognizer - Setup Instructions

Step-by-step guide to get the app running locally.

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- A Spotify account (free or premium)
- A Google account (for Firebase)

## Step 1: Setup Firebase

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it: `dance-recognizer` (or your choice)
4. Click "Create project"

### 1.2 Enable Authentication

1. Go to **Authentication** (left sidebar)
2. Click "Get started"
3. Choose "Email/Password" method
4. Enable it and save

### 1.3 Create Realtime Database

1. Go to **Realtime Database** (left sidebar)
2. Click "Create Database"
3. Start in **Test Mode** (for development)
4. Choose region: Europe (closest to Vienna)
5. Click "Enable"

### 1.4 Get Your Firebase Config

1. Click the gear ⚙️ icon → **Project Settings**
2. Scroll down to "Your apps"
3. Click the `</>` icon to add a web app
4. Register app (name: `dance-recognizer`)
5. You'll see a config object like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "dance-recognizer-xxxx.firebaseapp.com",
  databaseURL: "https://dance-recognizer-xxxx.firebaseio.com",
  projectId: "dance-recognizer-xxxx",
  storageBucket: "dance-recognizer-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

**Copy this config** - you'll need it soon.

## Step 2: Setup Spotify API

### 2.1 Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Sign up / Login with your Spotify account
3. Accept the terms and click "Create an App"
4. Fill in app name: `Dance Recognizer`
5. Accept terms and create
6. You'll see:
   - **Client ID**
   - **Client Secret** (click "Show Client Secret")

**Copy these - you'll need them.**

### 2.2 Add Redirect URI

1. Click "Edit Settings"
2. Find "Redirect URIs"
3. Add: `http://localhost:3000/callback`
4. Click "Add"
5. Save

## Step 3: Clone & Install

### 3.1 Get the Code

```bash
# Option A: If you're using GitHub
git clone https://github.com/YOUR_USERNAME/dance-recognizer.git
cd dance-recognizer

# Option B: If files are already on your computer
cd dance-recognizer  # navigate to the folder
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install React, Firebase, and other libraries.

## Step 4: Configure Environment Variables

### 4.1 Create .env.local

```bash
# Create a new file called ".env.local" in the root folder
# (Same folder as package.json)
```

### 4.2 Add Your Credentials

Copy your Firebase config and Spotify credentials into `.env.local`:

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=dance-recognizer-xxxx.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://dance-recognizer-xxxx.firebaseio.com
VITE_FIREBASE_PROJECT_ID=dance-recognizer-xxxx
VITE_FIREBASE_STORAGE_BUCKET=dance-recognizer-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Spotify
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

**⚠️ IMPORTANT**: This file should NOT be committed to GitHub. It's in `.gitignore`.

## Step 5: Update Firebase Security Rules

### 5.1 Update Database Rules

1. Go to Firebase Console → **Realtime Database**
2. Click "Rules" tab
3. Replace with:

```json
{
  "rules": {
    "ratings": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "progress": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

4. Click "Publish"

## Step 6: Run the App

```bash
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Open http://localhost:3000 in your browser.

## Step 7: Test It Out

1. **Sign Up**: Create an account with your email
2. **Login with Spotify**: Click "Sign in with Spotify"
3. **Authorize**: Allow access to public playlists
4. **Rate Songs**: You should see a song with 13 sliders
5. **Save**: Click "Save & Next" to save your rating

If you see errors, check the browser console (F12) for details.

## Troubleshooting

### "Cannot GET /callback"

**Issue**: After Spotify login, you get a 404 error
**Solution**: Make sure your redirect URI in `.env.local` matches exactly:
```
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### "No songs loading"

**Issue**: Blank screen or "Loading music library..."
**Solution**:
1. Check browser console for errors (F12)
2. Verify Spotify Client ID is correct
3. Make sure playlists are public or your account is premium
4. Check Firebase credentials in `.env.local`

### "Cannot save ratings"

**Issue**: Ratings don't persist
**Solution**:
1. Check Firebase database is created
2. Verify database rules (step 5)
3. Check if you're logged in
4. Look at browser console for Firebase errors

### "Cannot read properties of undefined"

**Issue**: App crashes on load
**Solution**:
1. Check all env variables are set correctly
2. Restart dev server: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)

## Next Steps

1. **Read the README**: More details about features
2. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to go live
3. **Start Rating**: Begin collecting training data!

## Need Help?

- Check browser console for errors (F12)
- Read Firebase documentation
- Check Spotify API docs
- Ask Claude for help debugging

---

**Great job! You're ready to start rating songs.** 🎵
