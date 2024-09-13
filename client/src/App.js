import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Game from './components/Game';
import Scoreboard from './components/Scoreboard';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null); 
  const [accuracy, setAccuracy] = useState(0); 

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user)); 
    fetchAccuracy(user.username);
    
  };

  const fetchAccuracy = async (username) => {
    try {
      const response = await fetch('http://localhost:5000/api/saveAccuracy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }) 
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setAccuracy(data.accuracy);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const saveAccuracy = async (newAccuracy) => {
    if (!user) return;
    await fetch('http://localhost:5000/api/saveAccuracy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, accuracy: newAccuracy })
    });
    if (newAccuracy > accuracy) setAccuracy(newAccuracy);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  return (
    <Router>
      <div className="App">
        <nav>
          {user ? (
            <>
              <span>Welcome, {user.username}!</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Navigate to="/login" />
          )}
        </nav>

        <Routes>
          <Route 
            path="/login" 
            element={<Auth onLogin={handleLogin} />} 
          />
          <Route 
            path="/game" 
            element={<Game username={user?.username} accuracy={accuracy} saveAccuracy={saveAccuracy} />} 
          />
          <Route 
            path="/scoreboard" 
            element={<Scoreboard username={user?.username} accuracy={accuracy} />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={user ? "/game" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
