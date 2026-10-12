import './ActionButtons.css';

function ActionButtons({
  onPrevious,
  onSkip,
  onSaveAndNext,
  isPrevDisabled,
  isSaving,
  isLastSong
}) {
  return (
    <div className="button-group">
      <button
        onClick={onPrevious}
        className="btn btn-secondary"
        disabled={isPrevDisabled || isSaving}
      >
        ← Back
      </button>
      <button
        onClick={onSkip}
        className="btn btn-secondary"
        disabled={isSaving}
      >
        Skip →
      </button>
      <button
        onClick={onSaveAndNext}
        className="btn btn-primary"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <span className="btn-spinner"></span>
            Saving...
          </>
        ) : isLastSong ? (
          'Save & Finish →'
        ) : (
          'Save & Next →'
        )}
      </button>
    </div>
  );
}

export default ActionButtons;
