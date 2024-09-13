import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
        navigate('/game');  // Redirect to the game page
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Failed to log in. Please try again later.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);  // Log in after successful signup
        navigate('/game');  // Redirect to the game page
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (error) {
      setError('Failed to sign up. Please try again later.');
    }
  };

  return (
    <div className="auth">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
      </form>

      <p>
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <button onClick={() => setIsSignUp(false)}>Login</button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button onClick={() => setIsSignUp(true)}>Sign Up</button>
          </>
        )}
      </p>
    </div>
  );
};

export default Auth;
