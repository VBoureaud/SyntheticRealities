const config = require('../config');
const {
  howManyDayBetweenTwoDate,
  getObjInArray,
} = require('../utils');
const { addslashes } = require('../utils');
const { calculatorXp, calculatorHp } = require('../utils/gameEngine');
const httpStatus = require('http-status');
const {
  Games,
  Card,
} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new Game
 * @param {Object} data
 * @param {string} [data.name]
 * @param {array} [data.players]
 * @param {number} [data.AiHp]
 * @param {number} [data.defaultPlayersHP]
 * @param {number} [data.timer]
 * @param {number} [data.maxCards]
 * @returns {Promise<Game>}
 */
const createGame = async (data) => {
  console.log('createGame');
  // check title
  let name = addslashes(data.name.trim());
  let lastCo = new Date().getTime();
  const games = await Games.find({ name: { $regex: `^${name}` } });
  name = name + '#' + (games.length ? games.length + 1 : 1);
  //throw new ApiError(httpStatus.BAD_REQUEST, 'Game already exist');

  const userDoc = await Games.create({
    name,
    players: data.players,
    AiHp: data.AiHp,
    defaultPlayersHP: data.defaultPlayersHP,
    timer: data.timer,
    isTimerFix: data.isTimerFix,
    maxCards: data.maxCards,
    lastCo,
  });

  return await getGame(name);
};

/**
 * Get all games
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const allGames = async (filter, options) => {
  const games = await Games.paginate(filter, options);
  return games;
};

/**
 * Get score game
 * @returns {Promise<QueryResult>}
 */
const scoreGame = async () => {
  const games = await Games.find({});
  const cardsDb = await Card.find({});
  const gamesFinishedWin = games.filter((game) => {
    const player = game.name.split('#')[0];
    const votes = game.votes.filter((vote) => vote.playerName === player);
    if (game.cards.length != votes.length) return false;
    //if (game.cards.length == game.maxCards) return true;
    const cardsAnswer = game.cards.map((card) => cardsDb.filter((cardDb) => cardDb.name === card)[0]);
    const votesPlayer = {};
    votesPlayer[player] = game.votes.filter((vote) => vote.playerName === player);
    const aiLife = calculatorHp(votesPlayer, cardsAnswer, game.AiHp, true);
    const playerLife = calculatorHp(votesPlayer, cardsAnswer, game.defaultPlayersHP, false);
    if (aiLife > 0 && playerLife > 0) return false;
    return aiLife <= 0;
  });
  const gamesScoreInfo = gamesFinishedWin.map((game) => {
    const player = game.name.split('#')[0];
    const votes = game.votes.filter((vote) => vote.playerName === player);
    const votesPlayer = {};
    votesPlayer[player] = game.votes.filter((vote) => vote.playerName === player);
    const cardsAnswer = game.cards.map((card) => cardsDb.filter((cardDb) => cardDb.name === card)[0]);
    const playerLife = calculatorHp(votesPlayer, cardsAnswer, game.defaultPlayersHP, false);
    return {
      ...game.toObject(),
      votes: votesPlayer,
      score: playerLife,
      scoreAi: calculatorHp(votesPlayer, cardsAnswer, game.defaultPlayersHP, true),
    }
  });
  return gamesScoreInfo;
};

/**
 * Get one game with this name
 * can be not found - when create new one
 * @param {string} name
 * @returns {Promise<QueryResult>}
 */
const getGame = async (name) => {
  console.log('getGame');

  let game = await Games.find({ name });
  let gameObj = game && game[0] ? game[0] : null;

  return gameObj;
};

/**
 * Update game by name
 * @param {string} name
 * @param {Object} updateBody
 * @param {Object} [updateBody.votes]
 * @param {string} [updateBody.cards]
 * @returns {Promise<Game>}
 */
const updateGameByName = async (name, updateBody) => {
  console.log('updateGameByName', updateBody);
  const game = await getGame(name);
  const now = new Date().getTime();
  if (!game)
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');

  const newData = {
    'votes': game.votes,
    'cards': game.cards,
  };
  if (updateBody.votes)
    newData['votes'].push(updateBody.votes);
  else if (updateBody.cards !== undefined)
    newData['cards'].push(updateBody.cards);

  const saved = await Games.findOneAndUpdate({ name }, newData, { useFindAndModify: false });
  return await getGame(name);
};

module.exports = {
  createGame,
  allGames,
  scoreGame,
  getGame,
  updateGameByName,
};
