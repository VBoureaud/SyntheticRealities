import { Request, Response } from 'express';
import httpStatus from 'http-status';
import gameService from '../services/game.service';
import catchAsync from '../utils/catchAsync';

const createGame = catchAsync(async (req: Request, res: Response) => {
  const game = await gameService.createGame(req.body);
  res.status(httpStatus.CREATED).send(game);
});

const getGameByName = catchAsync(async (req: Request, res: Response) => {
  const game = await gameService.getGameByName(req.params.name);
  res.send(game);
});

const updateGameByName = catchAsync(async (req: Request, res: Response) => {
  const game = await gameService.updateGameByName(req.params.name, req.body);
  res.send(game);
});

const deleteGameByName = catchAsync(async (req: Request, res: Response) => {
  await gameService.deleteGameByName(req.params.name);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllGames = catchAsync(async (req: Request, res: Response) => {
  const games = await gameService.getAllGames();
  res.send(games);
});

const getScoreGame = catchAsync(async (req: Request, res: Response) => {
  const scores = await gameService.getScoreGame();
  res.send(scores);
});

export default {
  createGame,
  getGameByName,
  updateGameByName,
  deleteGameByName,
  getAllGames,
  getScoreGame,
};


