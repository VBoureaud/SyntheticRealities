const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userVote = mongoose.Schema({
  playerName: {
    type: String,
    required: true,
  },
  stepStart: {
    type: Number,
    required: true,
  },
  stepEnd: {
    type: Number,
    required: true,
  },
  choice: {
    type: Number,
    required: true,
  },
  hp: {
    type: Number,
    required: true,
  },
});

const gamesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  players: {
    type: [String],
    required: true,
  },
  votes: {
    type: [userVote],
    default: [],
  },
  AiHp: {
    type: Number,
    required: true,
  },
  defaultPlayersHP: {
    type: Number,
    required: true,
  },
  timer: {
    type: Number,
    required: true,
  },
  isTimerFix: {
    type: Boolean,
    required: true,
  },
  cards: {
    type: [String],
    default: [],
  },
  maxCards: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
}
);

// add plugin that converts mongoose to json
gamesSchema.plugin(toJSON);
gamesSchema.plugin(paginate);

/**
 * @typedef Games
 */
const Games = mongoose.model('Games', gamesSchema);

module.exports = Games;
