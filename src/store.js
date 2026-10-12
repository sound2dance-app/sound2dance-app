import { create } from 'zustand';

const DANCES = [
  { id: 'waltz', name: 'Waltz', emoji: '🎭' },
  { id: 'tango', name: 'Tango', emoji: '💃' },
  { id: 'foxtrot', name: 'Foxtrot', emoji: '🕺' },
  { id: 'quickstep', name: 'Quickstep', emoji: '⚡' },
  { id: 'viennese_waltz', name: 'Viennese Waltz', emoji: '💫' },
  { id: 'cha_cha', name: 'Cha-Cha', emoji: '🔥' },
  { id: 'samba', name: 'Samba', emoji: '🥁' },
  { id: 'rumba', name: 'Rumba', emoji: '🌺' },
  { id: 'paso_doble', name: 'Paso Doble', emoji: '⚔️' },
  { id: 'jive', name: 'Jive', emoji: '🎉' },
  { id: 'salsa', name: 'Salsa', emoji: '🔥' },
  { id: 'bachata', name: 'Bachata', emoji: '💕' },
  { id: 'discofox', name: 'Discofox', emoji: '🎵' }
];

const SPOTIFY_PLAYLISTS = {
  waltz: '6zrmq6fqAOOV38itqmUmFq',
  tango: '11zN9q3cTGHQm62uqz84oJ',
  foxtrot: '1zeRNw3sxJZsvhJLqH804S',
  quickstep: '10g9GaRBG1NNqKK0fOt68A',
  viennese_waltz: '32hCSQ3HdgmOSmTmnp8Z1k',
  cha_cha: '3HLswY1mCUfjqiauZa3ODL',
  samba: '39NUoCLh3Mp0PuzfDCfXpH',
  rumba: '00OCAeX0ShoZw1SCN2pjPI',
  paso_doble: '3hXbxZHmxHieC6brv7I8cB',
  jive: '7IRusSZlnJ7ZmfMvY1vbhr',
  salsa: '3KhzObBmBS7eLXo48y4hlu',
  bachata: '3vjCys8imzRF0YLoIoWff3',
  discofox: '3EkpH3nGoTH1y3Cul7T4sf'
};

export const useStore = create((set, get) => ({
  // User state
  user: null,
  spotifyToken: null,
  isAuthenticated: false,

  // Song state
  currentSong: null,
  songs: [],
  currentSongIndex: 0,
  isPlaying: false,

  // Ratings
  ratings: {}, // { songId: { danceId: percentage, ... }, ... }

  // User progress
  totalSongsRated: 0,
  userLevel: 1,
  userPoints: 0,
  streakDays: 0,
  achievements: [],
  lastRatingDate: null,

  // Constants
  dances: DANCES,
  spotifyPlaylists: SPOTIFY_PLAYLISTS,
  targetRatings: 100, // Goal is 100 rated songs per dance

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSpotifyToken: (token) => set({ spotifyToken: token }),

  setCurrentSong: (song) => set({ currentSong: song }),
  setSongs: (songs) => set({ songs }),
  setCurrentSongIndex: (index) => set({ currentSongIndex: index }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),

  // Save ratings for current song
  rateCurrentSong: (danceRatings) => set((state) => {
    if (!state.currentSong) return state;

    const songId = state.currentSong.id;
    const newRatings = {
      ...state.ratings,
      [songId]: danceRatings
    };

    // Calculate points for consistency
    const values = Object.values(danceRatings).filter(v => v > 0);
    const isConsistent = values.length <= 3 && values.some(v => v >= 50);
    const points = isConsistent ? 10 : 5;

    return {
      ratings: newRatings,
      totalSongsRated: Object.keys(newRatings).length,
      userPoints: state.userPoints + points,
      userLevel: Math.floor(Object.keys(newRatings).length / 50) + 1
    };
  }),

  // Update streak
  updateStreak: () => set((state) => {
    const today = new Date().toDateString();
    const lastDate = state.lastRatingDate ? new Date(state.lastRatingDate).toDateString() : null;

    let newStreak = state.streakDays;
    if (lastDate !== today) {
      if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
        newStreak = state.streakDays + 1;
      } else {
        newStreak = 1;
      }
    }

    return {
      streakDays: newStreak,
      lastRatingDate: new Date().toISOString()
    };
  }),

  // Check and add achievements
  checkAchievements: () => set((state) => {
    const newAchievements = [...state.achievements];
    const songsRated = state.totalSongsRated;

    const milestones = [
      { songs: 25, id: 'first_25', title: '25 Songs', description: 'You\'re 1/4 of the way!' },
      { songs: 50, id: 'first_50', title: '50 Songs', description: 'Halfway to 100! Great work!' },
      { songs: 75, id: 'first_75', title: '75 Songs', description: 'Almost there! 25 songs left!' },
      { songs: 100, id: 'first_100', title: '100 Songs', description: 'Dataset complete! 🎉' }
    ];

    milestones.forEach(milestone => {
      if (songsRated >= milestone.songs && !newAchievements.some(a => a.id === milestone.id)) {
        newAchievements.push(milestone);
      }
    });

    return { achievements: newAchievements };
  }),

  // Move to next song
  nextSong: () => set((state) => {
    const nextIndex = state.currentSongIndex + 1;
    if (nextIndex < state.songs.length) {
      return {
        currentSongIndex: nextIndex,
        currentSong: state.songs[nextIndex],
        isPlaying: false
      };
    }
    return state;
  }),

  // Move to previous song
  previousSong: () => set((state) => {
    const prevIndex = state.currentSongIndex - 1;
    if (prevIndex >= 0) {
      return {
        currentSongIndex: prevIndex,
        currentSong: state.songs[prevIndex],
        isPlaying: false
      };
    }
    return state;
  }),

  // Load ratings for current song
  getCurrentSongRatings: () => {
    const state = get();
    if (!state.currentSong) return {};
    return state.ratings[state.currentSong.id] || {};
  },

  // Get all ratings
  getAllRatings: () => get().ratings,

  // Reset (for testing)
  reset: () => set({
    user: null,
    spotifyToken: null,
    isAuthenticated: false,
    currentSong: null,
    songs: [],
    currentSongIndex: 0,
    isPlaying: false,
    ratings: {},
    totalSongsRated: 0,
    userLevel: 1,
    userPoints: 0,
    streakDays: 0,
    achievements: [],
    lastRatingDate: null
  })
}));
