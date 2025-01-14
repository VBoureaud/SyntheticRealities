const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cardService, gamesService } = require('../services');
const { diacriticSensitiveRegex } = require('../utils');

const queryName = catchAsync(async (req, res) => {
  console.log('queryName');
  const name = req.params.name.replace(/[^a-zA-Z0-9 ]/g, '');

  const game = await gamesService.getGame(decodeURIComponent(req.params.partyName));
  if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not found');
  else if (!game.cards || name != game.cards[game.cards.length - 1])
    throw new ApiError(httpStatus.BAD_REQUEST, 'Game doesnt have this card yet.');
  // check if all votes ok
  for (let i = 0; i < game.players.length; i++) {
    const currentPlayer = game.players[i];
    const playerVote = game.votes.filter(e => e.playerName === currentPlayer);
    if (game.cards.length != playerVote.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not ready to show card.');
  }
  const card = await cardService.queryName(req.params.name);
  res.status(httpStatus.OK).send(card ? card[0] : null);
});

const getACard = catchAsync(async (req, res) => {
  console.log('getACard');
  const partyName = decodeURIComponent(req.params.partyName);

  const game = await gamesService.getGame(partyName);
  if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not found');
  const currentCards = game.cards;

  // check if all votes ok
  for (let i = 0; i < game.players.length; i++) {
    const currentPlayer = game.players[i];
    const playerVote = game.votes.filter(e => e.playerName === currentPlayer);
    if (game.cards.length != playerVote.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not ready for new card');
  }
  const newCard = await cardService.getACard(currentCards);
  if (!newCard) throw new ApiError(httpStatus.BAD_REQUEST, 'Card not found');
  const gameUpdated = await gamesService.updateGameByName(partyName, { cards: newCard.name });

  res.status(httpStatus.OK).send(newCard.name);
});

const initCards = catchAsync(async (req, res) => {
  console.log('initCards');
  await cardService.initCards();
  res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  queryName,
  getACard,
  initCards,
}