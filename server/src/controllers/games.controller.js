const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { gamesService } = require('../services');
const { sleep, diacriticSensitiveRegex } = require('../utils');

const addOne = catchAsync(async (req, res) => {
  const game = await gamesService.createGame(req.body);
  res.status(httpStatus.CREATED).send({ game });
});

const updateOne = catchAsync(async (req, res) => {
  // check if vote & vote possible
  if (req.body && req.body.votes) {
    const game = await gamesService.getGame(decodeURIComponent(req.params.name));
    if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not found');
    // check if all votes ok
    for (let i = 0; i < game.players.length; i++) {
      const currentPlayer = game.players[i];
      const playerVote = game.votes.filter(e => e.playerName === currentPlayer);
      if (game.cards.length <= playerVote.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not ready for new vote');
    }
  }

  const games = await gamesService.updateGameByName(decodeURIComponent(req.params.name), req.body);
  res.status(httpStatus.OK).send({ games: games });
});

const getGame = catchAsync(async (req, res) => {
  const name = req.params.name ? decodeURIComponent(req.params.name) : decodeURIComponent(req.query.name);
  const games = await gamesService.getGame(name);
  if (games) {
    return res.status(httpStatus.OK).send({ games: { ...games.toObject() } });
  }
  return res.status(httpStatus.OK).send({ games });
});

const allGames = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let filter = pick(req.query, ['name']);

  // search name
  if (filter && filter.name)
    filter = { ...filter, "name": { "$regex": diacriticSensitiveRegex(filter.name.toLowerCase()), "$options": "i" } }
  else delete filter['name']
  // search address
  if (filter && filter.address)
    filter = { ...filter, "address": { "$regex": diacriticSensitiveRegex(filter.address), "$options": "i" } }
  else delete filter['address']
  // search location
  if (filter && filter.location)
    filter = { ...filter, "location.name": { "$regex": diacriticSensitiveRegex(filter.location), "$options": "i" } }
  else delete filter['location']

  const games = await gamesService.allGames(filter, options);
  res.status(httpStatus.OK).send(games);
});

const scoreGame = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(await gamesService.scoreGame());
});

module.exports = {
  addOne,
  updateOne,
  getGame,
  allGames,
  scoreGame,
};