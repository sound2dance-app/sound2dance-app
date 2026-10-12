import './DanceSliders.css';

const PERCENT_OPTIONS = [25, 50, 75, 100];

function DanceSliders({ sliderValues, onSliderChange, dances }) {
  const handleButtonClick = (danceId, value) => {
    const current = sliderValues[danceId] || 0;
    // Clicking the already-selected value toggles it off (back to 0)
    onSliderChange(danceId, current === value ? 0 : value);
  };

  return (
    <div className="sliders-section">
      <h3 className="sliders-title">How well do these dances fit? (subjektive Einschätzung)</h3>
      {dances.map(dance => {
        const selected = sliderValues[dance.id] || 0;
        return (
          <div key={dance.id} className="slider-group">
            <div className="slider-label">
              <span className="dance-name">
                <span className="dance-emoji">{dance.emoji}</span>
                {dance.name}
              </span>
            </div>
            <div className="percent-buttons">
              {PERCENT_OPTIONS.map(value => (
                <button
                  key={value}
                  type="button"
                  className={`percent-button${selected === value ? ' percent-button-active' : ''}`}
                  onClick={() => handleButtonClick(dance.id, value)}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DanceSliders;
