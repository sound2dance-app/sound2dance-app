import { firebaseService } from '../firebaseService';
import './Header.css';

function Header({ totalSongs, level, points, streak }) {
  const handleLogout = async () => {
    if (!window.confirm('Wirklich ausloggen?')) return;
    await firebaseService.signOut();
    window.location.reload();
  };

  return (
    <div className="header">
      <div className="stats">
        <div className="stat">
          <div className="stat-number">{totalSongs}</div>
          <div className="stat-label">Songs</div>
        </div>
        <div className="stat">
          <div className="stat-number">{level}</div>
          <div className="stat-label">Level</div>
        </div>
        <div className="stat">
          <div className="stat-number">{points.toLocaleString()}</div>
          <div className="stat-label">Points</div>
        </div>
      </div>

      <div className="header-right">
        <div className="streak">
          <span className="streak-flame">🔥</span>
          <span className="streak-text">{streak} days</span>
        </div>
        <button onClick={handleLogout} className="logout-button" title="Logout">
          ⎋
        </button>
      </div>
    </div>
  );
}

export default Header;
