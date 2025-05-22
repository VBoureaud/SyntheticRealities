import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Game, IGame, IVote } from '../models/game.model';
import { Card, ICard } from '../models/card.model';
import ApiError from '../utils/ApiError';
import { addslashes } from '../utils';
import { calculatorHp } from '../utils/gameEngine';

/**
 * Create a game
 * @param {Object} gameContent - The game content
 * @returns {Promise<IGame>}
 */
const createGame = async (gameContent: any): Promise<IGame> => {
  // check title
  let name = addslashes(gameContent.name.trim());
  let lastCo = new Date().getTime();
  const games = await Game.find({ name: { $regex: `^${name}` } });
  name = name + '#' + (games.length ? games.length + 1 : 1);
  
  const newGame = await Game.create({
    name,
    players: gameContent.players,
    AiHp: gameContent.AiHp,
    defaultPlayersHP: gameContent.defaultPlayersHP,
    timer: gameContent.timer,
    isTimerFix: gameContent.isTimerFix,
    maxCards: gameContent.maxCards,
    lastCo,
  });

  return newGame;
};

/**
 * Get game by id
 * @param {string} name
 * @returns {Promise<Game>}
 */
const getGameByName = async (name: string): Promise<IGame> => {
  const game = await Game.findOne({ name });
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  return game;
};

/**
 * Update game by id
 * @param {string} name
 * @param {Object} updateBody
 * @returns {Promise<Game>}
 */
const updateGameByName = async (name: string, updateBody: { playerName: string; vote?: IVote; cardId?: string }): Promise<IGame> => {
  const game = await Game.findOne({ name });
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }

  const { playerName, vote, cardId } = updateBody;
  
  // Check if player exists in the game
  if (!game.players.includes(playerName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Player not found in game');
  }

  if (vote) {
    // Add the vote to the game
    const newVote: IVote = {
      playerName,
      stepStart: vote.stepStart,
      stepEnd: vote.stepEnd,
      choice: vote.choice,
      hp: vote.hp
    };
    game.votes = [...game.votes, newVote];
  } else if (cardId) {
    game.cards.push(cardId);
  }

  await game.save();
  return game;
};

/**
 * Delete game by id
 * @param {string} name
 * @returns {Promise<void>}
 */
const deleteGameByName = async (name: string): Promise<void> => {
  const game = await Game.findOne({ name });
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  await game.deleteOne();
};

/**
 * Get all games
 * @returns {Promise<IGame[]>}
 */
const getAllGames = async (): Promise<IGame[]> => {
  const games = await Game.find();
  return games;
};

/**
 * Get score game
 * @returns {Promise<QueryResult>}
 */
const getScoreGame = async () => {
  const games = await Game.find({});
  const cardsDb = await Card.find({});
  const gamesFinishedWin = games.filter((game) => {
    const player = game.name.split('#')[0];
    const votes = game.votes.filter((vote) => vote.playerName === player);
    if (game.cards.length !== votes.length) return false;
    const cardsAnswer = game.cards.map((card) => cardsDb.filter((cardDb) => cardDb.name === card)[0]);
    let votesPlayer: {[key:string]: IVote[]} = {};
    votesPlayer[player] = game.votes.filter((vote) => vote.playerName === player);
    const aiLife = calculatorHp(votesPlayer, cardsAnswer, game.AiHp, true);
    const playerLife = calculatorHp(votesPlayer, cardsAnswer, game.defaultPlayersHP, false);
    if (aiLife > 0 && playerLife > 0) return false;
    return aiLife <= 0;
  });
  const gamesScoreInfo = gamesFinishedWin.map((game) => {
    const player = game.name.split('#')[0];
    const votes = game.votes.filter((vote) => vote.playerName === player);
    const votesPlayer: {[key:string]: IVote[]} = {};
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

export default {
  createGame,
  getGameByName,
  updateGameByName,
  deleteGameByName,
  getAllGames,
  getScoreGame,
};