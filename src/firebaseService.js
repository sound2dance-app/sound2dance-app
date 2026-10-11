import { database, auth } from './firebase';
import {
  ref,
  set,
  get,
  update,
  push,
  query,
  orderByChild,
  equalTo,
  remove
} from 'firebase/database';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

export const firebaseService = {
  // Authentication
  signInAnonymously: async () => {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  },

  signInWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  createUserWithEmail: async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Save song rating
  saveSongRating: async (userId, songId, ratings, songMetadata = {}) => {
    try {
      const ratingRef = ref(database, `ratings/${userId}/${songId}`);
      await set(ratingRef, {
        ...ratings,
        metadata: {
          title: songMetadata.title,
          artist: songMetadata.artist,
          duration: songMetadata.duration,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      throw error;
    }
  },

  // Get user ratings
  getUserRatings: async (userId) => {
    try {
      const ratingsRef = ref(database, `ratings/${userId}`);
      const snapshot = await get(ratingsRef);
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting ratings:', error);
      throw error;
    }
  },

  // Get single rating
  getSingleRating: async (userId, songId) => {
    try {
      const ratingRef = ref(database, `ratings/${userId}/${songId}`);
      const snapshot = await get(ratingRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting rating:', error);
      throw error;
    }
  },

  // Update user progress
  updateUserProgress: async (userId, progress) => {
    try {
      const progressRef = ref(database, `progress/${userId}`);
      await update(progressRef, {
        ...progress,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  // Get user progress
  getUserProgress: async (userId) => {
    try {
      const progressRef = ref(database, `progress/${userId}`);
      const snapshot = await get(progressRef);
      return snapshot.exists() ? snapshot.val() : {
        level: 1,
        points: 0,
        streak: 0,
        achievements: [],
        lastRatingDate: null
      };
    } catch (error) {
      console.error('Error getting progress:', error);
      throw error;
    }
  },

  // Delete rating
  deleteRating: async (userId, songId) => {
    try {
      const ratingRef = ref(database, `ratings/${userId}/${songId}`);
      await remove(ratingRef);
    } catch (error) {
      console.error('Error deleting rating:', error);
      throw error;
    }
  },

  // Get summary statistics
  getUserStats: async (userId) => {
    try {
      const ratings = await firebaseService.getUserRatings(userId);
      const ratedSongs = Object.keys(ratings).length;

      const danceStats = {};
      const dances = [
        'waltz', 'tango', 'foxtrot', 'quickstep', 'viennese_waltz',
        'cha_cha', 'samba', 'rumba', 'paso_doble', 'jive', 'salsa', 'bachata', 'discofox'
      ];

      dances.forEach(dance => {
        let count = 0;
        let total = 0;
        Object.values(ratings).forEach(songRatings => {
          if (songRatings[dance] > 0) {
            count++;
            total += songRatings[dance];
          }
        });
        danceStats[dance] = {
          count,
          avgRating: count > 0 ? Math.round(total / count) : 0
        };
      });

      return {
        ratedSongs,
        danceStats
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
};
