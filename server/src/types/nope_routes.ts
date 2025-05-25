import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

export interface RouteHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void> | void;
}

export interface Route {
  path: string;
  router: Router;
}

export interface CardRequest extends Request {
  body: {
    id?: number;
    url: string;
    isHuman: boolean;
  };
}

export interface GameRequest extends Request {
  body: {
    cards: number[];
    cardsAnswer: Array<{
      isHuman: boolean;
      isAI: boolean;
    }>;
    AiHP: number;
    defaultPlayersHP: number;
  };
  params: {
    partyId: string;
  };
}

export interface VoteRequest extends Request {
  body: {
    choice: number;
    hp: number;
    stepStart: number;
    stepEnd: number;
  };
  params: {
    partyId: string;
    playerName: string;
  };
} 