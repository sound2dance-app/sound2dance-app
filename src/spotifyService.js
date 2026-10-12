const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private'
];
// Note: 'playlist-read-public' is a known-broken scope on Spotify's side as
// of 2026 - requesting it always returns invalid_scope (confirmed via
// Spotify's developer community forum, not something fixable on our end).
// We don't actually need it: we fetch specific playlist IDs directly rather
// than listing the user's own playlists, and Spotify allows reading public
// playlists' tracks without any scope at all.

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
    // URLSearchParams encodes spaces as '+'. Spotify's authorize endpoint
    // does not reliably decode '+' back to a space in the scope param,
    // causing a generic invalid_scope error for any multi-scope request.
    // Use %20 instead, which is unambiguous.
    const query = params.toString().replace(/\+/g, '%20');
    return `https://accounts.spotify.com/authorize?${query}`;
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
    // Spotify removed GET /playlists/{id}/tracks for Development Mode apps
    // in Feb 2026 (403 Forbidden) - use /items instead, same response shape.
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/items?limit=50`;
    let page = 0;
    const MAX_PAGES = 30; // safety cap - a runaway 'next' pointer must not hang forever

    while (url) {
      page += 1;
      console.log(`[spotify] ${playlistId} page ${page}: fetching ${url}`);
      if (page > MAX_PAGES) {
        console.error(`[spotify] ${playlistId}: exceeded ${MAX_PAGES} pages, aborting pagination`);
        break;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      let response;
      try {
        response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error(`Timed out after 15s fetching page ${page} of playlist ${playlistId}`);
        }
        throw err;
      }
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to get playlist tracks: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[spotify] ${playlistId} page ${page}: got ${data.items?.length ?? 0} items, next=${data.next}`);

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

    console.log(`[spotify] ${playlistId}: done, ${tracks.length} tracks total`);
    return tracks;
  },

  // Get multiple playlists tracks
  getMultiplePlaylistsTracks: async (playlistIds, token) => {
    const allTracks = {};

    for (const [danceId, playlistId] of Object.entries(playlistIds)) {
      console.log(`[spotify] starting playlist ${danceId} (${playlistId})`);
      try {
        allTracks[danceId] = await spotifyService.getPlaylistTracks(playlistId, token);
        console.log(`[spotify] finished playlist ${danceId}: ${allTracks[danceId].length} tracks`);
      } catch (error) {
        console.error(`Error loading playlist ${danceId}:`, error);
        allTracks[danceId] = [];
      }
    }
    console.log('[spotify] all playlists done', Object.keys(allTracks).length);

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
