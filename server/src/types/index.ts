import { Server } from 'http';
import { Express } from 'express';
import mongoose from 'mongoose';

export interface Vote {
    playerName: string;
    vote: {
        choice: number;
        hp: number;
        stepStart: number;
        stepEnd: number;
    };
}

export interface Game {
    name: string;
    players: string[];
    cards: string[];
    cardsAnswer: { isHuman: boolean; isAI: boolean }[];
    AiHP: number;
    defaultPlayersHP: number;
    votes: { [key: string]: Vote[] };
}
  
export interface ErrorResponse extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
} 