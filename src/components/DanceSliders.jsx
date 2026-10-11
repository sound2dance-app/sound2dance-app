import './DanceSliders.css';

function DanceSliders({ sliderValues, onSliderChange, dances }) {
  return (
    <div className="sliders-section">
      <h3 className="sliders-title">How well do these dances fit? (0-100%)</h3>
      {dances.map(dance => (
        <div key={dance.id} className="slider-group">
          <div className="slider-label">
            <span className="dance-name">
              <span className="dance-emoji">{dance.emoji}</span>
              {dance.name}
            </span>
            <span className="dance-value">
              {sliderValues[dance.id] || 0}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValues[dance.id] || 0}
            onChange={(e) => onSliderChange(dance.id, e.target.value)}
            className="slider-input"
          />
        </div>
      ))}
    </div>
  );
}

export default DanceSliders;
