import React, { useState } from 'react';
import Confetti from 'react-confetti';

const Game = ({ username, accuracy, saveAccuracy }) => {
  const [guess, setGuess] = useState('');
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [feedback, setFeedback] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [overallCorrect, setOverallCorrect] = useState(0);
  const [overallIncorrect, setOverallIncorrect] = useState(0);

  const totalGuesses = correctGuesses + incorrectGuesses;
  const currentAccuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;

  const totalOverallGuesses = overallCorrect + overallIncorrect;
  const overallAccuracy = totalOverallGuesses > 0 ? Math.round((overallCorrect / totalOverallGuesses) * 100) : 0;

  const updateAccuracy = async (newAccuracy) => {
    try {
      const response = await fetch('http://localhost:5000/api/saveAccuracy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, accuracy: newAccuracy })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Max accuracy updated:', data.accuracy);
      } else {
        console.error('Error updating accuracy');
      }
    } catch (error) {
      console.error('Failed to update accuracy:', error);
    }
  };

  const handleGuess = () => {
    const guessNum = parseInt(guess, 10);
    if (guessNum === targetNumber) {
      setFeedback('Correct!');
      setCorrectGuesses(correctGuesses + 1);
      setOverallCorrect(overallCorrect + 1);
      setGameOver(true);
      setShowConfetti(true);

      if (currentAccuracy > accuracy) {
        saveAccuracy(currentAccuracy);
        updateAccuracy(currentAccuracy);
      }
    } else {
      setFeedback(guessNum > targetNumber ? 'Too high!' : 'Too low!');
      setIncorrectGuesses(incorrectGuesses + 1);
      setOverallIncorrect(overallIncorrect + 1);
    }
  };

  const playAgain = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setFeedback('');
    setGameOver(false);
    setShowConfetti(false);
    setCorrectGuesses(0);
    setIncorrectGuesses(0);
    setGamesPlayed(gamesPlayed + 1);
  };

  

  return (
    <div className="game">
      {showConfetti && <Confetti />}
      <h1>Number Guessing Game</h1>
      <p>Guess a number between 1 and 100:</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={gameOver}
      />
      <button onClick={handleGuess} disabled={gameOver}>Guess</button>
      <p>{feedback}</p>

      <p>Correct Guesses: {correctGuesses}</p>
      <p>Incorrect Guesses: {incorrectGuesses}</p>
      <p>Current Accuracy: {currentAccuracy}%</p>

      {gameOver && (
        <>
          <p>Game Over! Your accuracy this round: {currentAccuracy}%</p>
          <button onClick={playAgain}>Play Again</button>
        </>
      )}

      {gamesPlayed > 0 && (
        <>
          <hr />
          <h2>Overall Statistics</h2>
          <p>Total Games Played: {gamesPlayed}</p>
          <p>Overall Correct Guesses: {overallCorrect}</p>
          <p>Overall Incorrect Guesses: {overallIncorrect}</p>
          <p>Overall Accuracy: {overallAccuracy}%</p>
        </>
      )}
    </div>
  );
};

export default Game;
