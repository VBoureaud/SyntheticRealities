import { Request, Response } from 'express';
import httpStatus from 'http-status';
import cardService from '../services/card.service';
import catchAsync from '../utils/catchAsync';
import gameService from '../services/game.service';
import ApiError from '../utils/ApiError';

const initCards = catchAsync(async (req: Request, res: Response) => {
  const success = await cardService.initCards();
  res.send({ success })
});

const getAllCards = catchAsync(async (req: Request, res: Response) => {
  const cards = await cardService.getAllCards();
  res.send(cards);
});

const getNewCard = catchAsync(async (req: Request, res: Response) => {
  const { partyName } = req.params;
  const game = await gameService.getGameByName(decodeURIComponent(partyName));
  if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not found');

  // check if all votes ok
  for (let i = 0; i < game.players.length; i++) {
    const currentPlayer = game.players[i];
    const playerVote = game.votes.filter(e => e.playerName === currentPlayer);
    if (game.cards.length != playerVote.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not ready to add a card.');
  }

  const newCard = await cardService.getNewCard(game.cards);
  const updateBody = { playerName: game.players[0], cardId: newCard.name };
  const gameUpdated = await gameService.updateGameByName(partyName, updateBody);

  res.status(httpStatus.OK).send({ newCard: newCard.name });
});

const getCardByName = catchAsync(async (req: Request, res: Response) => {
  const { partyName, name } = req.params;
  //const name_fixed = req.params.name.replace(/[^a-zA-Z0-9 ]/g, '');
  const game = await gameService.getGameByName(decodeURIComponent(partyName));
  if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not found');
  else if (!game.cards || name != game.cards[game.cards.length - 1])
    throw new ApiError(httpStatus.BAD_REQUEST, 'Game doesnt have this card yet.');
  
  // check if all votes ok
  for (let i = 0; i < game.players.length; i++) {
    const currentPlayer = game.players[i];
    const playerVote = game.votes.filter(e => e.playerName === currentPlayer);
    if (game.cards.length != playerVote.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Game not ready to show card.');
  }

  const card = await cardService.queryCardByName(name);
  res.status(httpStatus.OK).send(card ? card : null);
});

const getRandomCard = catchAsync(async (req: Request, res: Response) => {
  const currentCards = req.body.currentCards || [];
  const card = await cardService.getRandomCard(currentCards);
  res.send(card);
});

const createCard = catchAsync(async (req: Request, res: Response) => {
  const card = await cardService.createCard(req.body);
  res.status(httpStatus.CREATED).send(card);
});

export default {
  initCards,
  getAllCards,
  getCardByName,
  getNewCard,
  getRandomCard,
  createCard,
}; 