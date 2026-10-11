# Dance Recognizer - Labeling Tool

A React-based web application for Christoph Hoang to rate 100+ songs across 13 dance categories. This tool collects training data for a future AI-powered dance recognition system.

## Features

✅ **Spotify Integration** - Load songs from 13 dance-specific playlists
✅ **Music Ratings** - Rate each song for 13 dance categories (0-100%)
✅ **Gamification** - Points, levels, streaks, and achievements
✅ **Data Persistence** - Firebase Realtime Database for storing ratings
✅ **User Authentication** - Firebase Auth (Email/Password or Anonymous)
✅ **Responsive Design** - Works on desktop and mobile
✅ **Progress Tracking** - Visual progress bar and statistics

## Technology Stack

- **Frontend**: React 18 + Vite
- **State Management**: Zustand
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **API**: Spotify Web API
- **Styling**: CSS3

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginScreen.jsx         # Authentication screen
│   ├── LabelingScreen.jsx       # Main rating interface
│   ├── Header.jsx              # Stats and streak display
│   ├── SongCard.jsx            # Song info and play button
│   ├── DanceSliders.jsx        # 13 slider inputs
│   ├── ActionButtons.jsx       # Save/Next buttons
│   └── AchievementNotification.jsx
├── App.jsx             # Main app component
├── firebase.js         # Firebase initialization
├── firebaseService.js  # Firebase CRUD operations
├── spotifyService.js   # Spotify API integration
├── store.js            # Zustand state management
└── main.jsx           # React entry point
```

## Quick Start

### 1. Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account (free tier works)
- Spotify Developer account

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable:
   - **Authentication** (Email/Password method)
   - **Realtime Database** (Create in test mode, then update rules)
4. Copy your Firebase config from Project Settings

### 3. Setup Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Accept terms and get your Client ID & Client Secret
4. Add Redirect URI: `http://localhost:3000/callback` (for development)

### 4. Install & Configure

```bash
# Install dependencies
npm install

# Create .env.local with your credentials
cp .env.example .env.local

# Fill in your Firebase and Spotify credentials:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_SPOTIFY_CLIENT_ID=...
# VITE_SPOTIFY_CLIENT_SECRET=...
# VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### 5. Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 6. Firebase Security Rules

Update your Realtime Database rules to allow authenticated users to write their own data:

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

## How to Use

### For Christoph

1. **Login** - Sign up with email or continue as guest
2. **Connect Spotify** - Click login to authorize Spotify access
3. **Rate Songs** - See a song, rate how well each dance fits it (0-100%)
4. **Save & Move** - Click "Save & Next" to rate the next song
5. **Gamification** - Track your progress with points, levels, and streaks

### Data Structure

Each rating is stored as:
```json
{
  "ratings": {
    "userId": {
      "songId": {
        "waltz": 85,
        "tango": 10,
        "foxtrot": 5,
        "quickstep": 0,
        ...
        "metadata": {
          "title": "Song Title",
          "artist": "Artist Name",
          "timestamp": "2026-10-12T10:30:00Z"
        }
      }
    }
  }
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update Spotify Redirect URI to your Vercel domain

```bash
# Or deploy manually
npm run build
vercel --prod
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## API Endpoints (Future)

For the ML model phase, you'll want to create Cloud Functions:

- `POST /api/ratings` - Save rating
- `GET /api/ratings/stats` - Get user statistics
- `GET /api/songs/next` - Get next song to rate

## Data Export

To export ratings for ML training:

```javascript
// In Firebase Console > Realtime Database > Export JSON
// Or use this in a backend function:
const db = getDatabase();
const ratingsRef = ref(db, 'ratings');
const snapshot = await get(ratingsRef);
const data = snapshot.val();
// Download as JSON for model training
```

## Troubleshooting

### Songs not loading?
- Check Spotify Client ID is correct
- Verify playlists are public or your account is premium
- Check browser console for API errors

### Ratings not saving?
- Verify Firebase credentials
- Check database rules allow writes
- Ensure user is authenticated

### Spotify playback not working?
- The MVP uses `spotify:track:` URIs (opens Spotify app)
- For in-app playback, implement Spotify Web Playback SDK
- Requires Spotify Premium account

## Next Steps (Phase 1+)

1. **ML Model Training**
   - Extract audio features using Librosa
   - Train classifier on collected ratings
   - Implement backend prediction API

2. **Audio Recognition**
   - Add audio upload/recording feature
   - Implement Shazam-like song identification
   - Show predicted dance percentages

3. **Advanced Features**
   - Leaderboards & social sharing
   - Batch export for ML training
   - Analytics dashboard
   - Integration with Hochzeitstanz Wien website

## Contributing

For development:
```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## License

Private project for Hochzeitstanz Wien

## Support

Questions? Check the Vault docs in:
`/Users/pcho/Documents/Obsidian/zweites Gehirn/02 Projekte/App Tanzerkennung.md`
