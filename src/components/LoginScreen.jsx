import { useState } from 'react';
import { firebaseService } from '../firebaseService';
import { spotifyService } from '../spotifyService';
import './LoginScreen.css';

function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await firebaseService.signInAnonymously();
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Anonymous login failed');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let user;
      if (isSignUp) {
        user = await firebaseService.createUserWithEmail(email, password);
      } else {
        user = await firebaseService.signInWithEmail(email, password);
      }

      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dance Recognizer</h1>
          <p className="subtitle">Music Rating Labeling Tool</p>
        </div>

        <form onSubmit={handleEmailAuth} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>

          <p className="toggle-auth">
            {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              disabled={loading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          onClick={handleAnonymousLogin}
          className="btn btn-secondary"
          disabled={loading}
        >
          <span className="icon">👤</span>
          Continue as Guest
        </button>

        <p className="info-text">
          You'll need to connect your Spotify account to access music.
        </p>
      </div>

      <div className="login-footer">
        <p>🎵 Rate songs. Build the dance recognizer. 🎵</p>
      </div>
    </div>
  );
}

export default LoginScreen;
