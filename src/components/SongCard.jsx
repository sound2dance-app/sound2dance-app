import { useState } from 'react';
import './SongCard.css';

function SongCard({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  const handlePlayClick = () => {
    if (!song.uri) {
      setError('Unable to play this song');
      return;
    }

    // Note: In production, you'd use Spotify Web Playback SDK
    // For MVP, we open Spotify directly
    try {
      window.open(`spotify:track:${song.id}`, '_blank');
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    } catch (err) {
      setError('Could not open Spotify');
    }
  };

  return (
    <div className="song-card">
      <div className="song-image-container">
        {song.imageUrl ? (
          <img
            src={song.imageUrl}
            alt={song.title}
            className="song-image"
          />
        ) : (
          <div className="song-image-placeholder">
            <span>🎵</span>
          </div>
        )}
      </div>

      <div className="song-info">
        <div className="song-title">{song.title}</div>
        <div className="song-artist">{song.artist}</div>
      </div>

      <button
        onClick={handlePlayClick}
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        disabled={isPlaying}
      >
        {isPlaying ? '▶ Playing...' : '▶ Open in Spotify'}
      </button>

      {error && <div className="play-error">{error}</div>}
    </div>
  );
}

export default SongCard;
