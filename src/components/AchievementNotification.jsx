import './AchievementNotification.css';

function AchievementNotification({ achievement }) {
  if (!achievement) return null;

  return (
    <div className="achievement-notification">
      <div className="achievement-content">
        <div className="achievement-title">{achievement.title}</div>
        <div className="achievement-text">{achievement.description}</div>
      </div>
    </div>
  );
}

export default AchievementNotification;
