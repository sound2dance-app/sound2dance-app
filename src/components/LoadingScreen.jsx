import './LoadingScreen.css';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
