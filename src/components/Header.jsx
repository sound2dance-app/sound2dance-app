import './Header.css';

function Header({ totalSongs, level, points, streak }) {
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

      <div className="streak">
        <span className="streak-flame">🔥</span>
        <span className="streak-text">{streak} days</span>
      </div>
    </div>
  );
}

export default Header;
