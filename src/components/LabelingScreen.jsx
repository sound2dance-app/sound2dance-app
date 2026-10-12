import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { firebaseService } from '../firebaseService';
import Header from './Header';
import SongCard from './SongCard';
import DanceSliders from './DanceSliders';
import ActionButtons from './ActionButtons';
import AchievementNotification from './AchievementNotification';
import './LabelingScreen.css';

function LabelingScreen() {
  const {
    user,
    currentSong,
    currentSongIndex,
    songs,
    dances,
    nextSong,
    previousSong,
    rateCurrentSong,
    getCurrentSongRatings,
    checkAchievements,
    updateStreak,
    totalSongsRated,
    userLevel,
    userPoints,
    streakDays,
    achievements
  } = useStore();

  const [sliderValues, setSliderValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [error, setError] = useState('');

  // Initialize sliders with current song's ratings
  useEffect(() => {
    if (currentSong) {
      const currentRatings = getCurrentSongRatings();
      const initialValues = {};
      dances.forEach(dance => {
        initialValues[dance.id] = currentRatings[dance.id] || 0;
      });
      setSliderValues(initialValues);
    }
  }, [currentSong, dances, getCurrentSongRatings]);

  const handleSliderChange = (danceId, value) => {
    setSliderValues(prev => ({
      ...prev,
      [danceId]: parseInt(value)
    }));
  };

  const handleSaveAndNext = async () => {
    if (!currentSong || !user) return;

    try {
      setSaving(true);
      setError('');

      // Check if any dance was rated
      const hasRating = Object.values(sliderValues).some(v => v > 0);
      if (!hasRating) {
        setError('Please rate at least one dance category');
        setSaving(false);
        return;
      }

      // Save to Zustand store
      rateCurrentSong(sliderValues);

      // Save to Firebase
      await firebaseService.saveSongRating(
        user.uid,
        currentSong.id,
        sliderValues,
        {
          title: currentSong.title,
          artist: currentSong.artist,
          duration: currentSong.duration
        }
      );

      // Update streak and progress
      updateStreak();

      // Check for new achievements
      const oldAchievementCount = achievements.length;
      checkAchievements();
      const { achievements: newAchievements } = useStore.getState();

      if (newAchievements.length > oldAchievementCount) {
        setNewAchievement(newAchievements[newAchievements.length - 1]);
        setTimeout(() => setNewAchievement(null), 3000);
      }

      // Update user progress in Firebase
      const { userLevel: level, userPoints: points, streakDays: streak } = useStore.getState();
      await firebaseService.updateUserProgress(user.uid, {
        level,
        points,
        streak,
        totalSongsRated: totalSongsRated + 1,
        achievements: newAchievements
      });

      // Move to next song
      nextSong();
      setSaving(false);
    } catch (err) {
      console.error('Error saving rating:', err);
      setError('Failed to save. Please try again.');
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    previousSong();
  };

  const handleSkip = () => {
    // Skip without saving a rating - just move to the next song.
    setError('');
    nextSong();
  };

  if (!currentSong) {
    return <div className="labeling-screen">No songs loaded</div>;
  }

  const progress = Math.round((currentSongIndex + 1) / songs.length * 100);

  return (
    <div className="labeling-screen">
      {newAchievement && (
        <AchievementNotification achievement={newAchievement} />
      )}

      <div className="labeling-container">
        <Header
          totalSongs={totalSongsRated}
          level={userLevel}
          points={userPoints}
          streak={streakDays}
        />

        <div className="progress-section">
          <div className="progress-header">
            <span>Progress to Dataset</span>
            <span className="progress-count">
              <strong>{currentSongIndex + 1}/{songs.length}</strong>
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <SongCard song={currentSong} />

        <DanceSliders
          sliderValues={sliderValues}
          onSliderChange={handleSliderChange}
          dances={dances}
        />

        {error && <div className="error-banner">{error}</div>}

        <ActionButtons
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          onSaveAndNext={handleSaveAndNext}
          isPrevDisabled={currentSongIndex === 0}
          isSaving={saving}
          isLastSong={currentSongIndex === songs.length - 1}
        />
      </div>
    </div>
  );
}

export default LabelingScreen;
