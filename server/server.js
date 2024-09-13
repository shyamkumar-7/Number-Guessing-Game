const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 

const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());



const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api',(req,res)=>{
    res.send('hello')
})

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const newUser = new User({ username, password, highScore: 0 });
    await newUser.save();
    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error('Error in /api/register:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});





app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.status(200).json({ success: true, user });
  } else {
    res.status(401).json({ success: false });
  }
});


app.post('/api/saveAccuracy', async (req, res) => {
  const { username, accuracy } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (accuracy > user.accuracy) {
      user.accuracy = accuracy;
    }

    await user.save();
    res.status(200).json({ message: 'Accuracy updated', accuracy: user.accuracy });
  } catch (error) {
    res.status(500).json({ message: 'Error updating accuracy', error });
  }
});


app.post('/api/saveGameStats', async (req, res) => {
  const { username, correctGuesses, incorrectGuesses, overallAccuracy } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.correctGuesses += correctGuesses;
    user.incorrectGuesses += incorrectGuesses;

    const totalGuesses = user.correctGuesses + user.incorrectGuesses;
    if (totalGuesses > 0) {
      user.overallAccuracy = (user.correctGuesses / totalGuesses) * 100;
    }

    await user.save();
    res.status(200).json({ message: 'Game stats updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating game stats', error });
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
