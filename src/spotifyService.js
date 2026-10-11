const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-public'
];

export const spotifyService = {
  // Get authorization URL
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: SPOTIFY_REDIRECT_URI,
      scope: SCOPES.join(' '),
      show_dialog: true
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  },

  // Get access token from auth code
  getAccessToken: async (code) => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    };
  },

  // Get current user profile
  getCurrentUser: async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return response.json();
  },

  // Get songs from playlist
  getPlaylistTracks: async (playlistId, token) => {
    const tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

    while (url) {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get playlist tracks: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract track info
      data.items.forEach(item => {
        if (item.track && item.track.id) {
          tracks.push({
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists.map(a => a.name).join(', '),
            uri: item.track.uri,
            imageUrl: item.track.album?.images?.[0]?.url || null,
            duration: item.track.duration_ms
          });
        }
      });

      // Get next page
      url = data.next || null;
    }

    return tracks;
  },

  // Get multiple playlists tracks
  getMultiplePlaylistsTracks: async (playlistIds, token) => {
    const allTracks = {};

    for (const [danceId, playlistId] of Object.entries(playlistIds)) {
      try {
        allTracks[danceId] = await spotifyService.getPlaylistTracks(playlistId, token);
      } catch (error) {
        console.error(`Error loading playlist ${danceId}:`, error);
        allTracks[danceId] = [];
      }
    }

    return allTracks;
  },

  // Get unique songs from all playlists (avoiding duplicates)
  getUniqueSongs: (playlistTracks) => {
    const songMap = new Map();

    Object.entries(playlistTracks).forEach(([danceId, tracks]) => {
      tracks.forEach(track => {
        if (!songMap.has(track.id)) {
          songMap.set(track.id, track);
        }
      });
    });

    return Array.from(songMap.values()).sort(() => Math.random() - 0.5);
  },

  // Play a track on user's active device
  playTrack: async (trackUri, token, deviceId) => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to play track');
    }
  },

  // Pause playback
  pausePlayback: async (token, deviceId) => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/pause${deviceId ? `?device_id=${deviceId}` : ''}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to pause playback');
    }
  }
};
