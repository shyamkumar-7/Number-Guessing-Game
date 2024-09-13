import React from 'react';

const Scoreboard = ({ username, accuracy }) => (
  <div className="scoreboard">
    <h2>{username}'s Scoreboard</h2>
    <p>Accuracy: {accuracy}%</p>
  </div>
);

export default Scoreboard;
