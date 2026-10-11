import { useState, useEffect } from 'react';
import { useStore } from './store';
import { firebaseService } from './firebaseService';
import { spotifyService } from './spotifyService';
import { auth } from './firebase';
import LoginScreen from './components/LoginScreen';
import LabelingScreen from './components/LabelingScreen';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
  const {
    user,
    isAuthenticated,
    spotifyToken,
    songs,
    setUser,
    setSpotifyToken,
    setSongs,
    setCurrentSongIndex,
    setCurrentSong
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser]);

  // Handle Spotify callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && user && !spotifyToken) {
      handleSpotifyCallback(code);
    }
  }, [user, spotifyToken]);

  const handleSpotifyCallback = async (code) => {
    try {
      setLoading(true);
      setError(null);

      // Get access token
      const { accessToken } = await spotifyService.getAccessToken(code);
      setSpotifyToken(accessToken);

      // Load playlists
      const playlistIds = useStore.getState().spotifyPlaylists;
      const playlistTracks = await spotifyService.getMultiplePlaylistsTracks(
        playlistIds,
        accessToken
      );

      // Get unique songs
      const uniqueSongs = spotifyService.getUniqueSongs(playlistTracks);
      setSongs(uniqueSongs);

      if (uniqueSongs.length > 0) {
        setCurrentSong(uniqueSongs[0]);
        setCurrentSongIndex(0);
      }

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error('Error in Spotify callback:', err);
      setError('Failed to load music. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (user) => {
    try {
      setLoading(true);
      setUser(user);
      // Redirect to Spotify auth
      window.location.href = spotifyService.getAuthUrl();
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (songs.length === 0) {
    return <LoadingScreen message="Loading music library..." />;
  }

  return <LabelingScreen />;
}

export default App;
