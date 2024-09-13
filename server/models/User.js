const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  correctGuesses: { type: Number, default: 0 },
  incorrectGuesses: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 }, 
});

module.exports = mongoose.model('User', UserSchema);
