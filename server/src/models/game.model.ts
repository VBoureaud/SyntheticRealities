import mongoose, { Schema, Document } from 'mongoose';
import { toJSON } from './plugins/toJSON';

export interface IVote {
    playerName: string;
    stepStart: number;
    stepEnd: number;
    choice: number;
    hp: number;
}

export interface IGame extends Document {
    name: string;
    players: [string];
    votes: IVote[];
    AiHp: number;
    defaultPlayersHP: number;
    timer: number;
    isTimerFix: boolean;
    cards: [string];
    maxCards: number;
    [key: string]: any; // Allow for additional game-specific fields
}

const voteSchema = new Schema<IVote>({
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

const gameSchema = new Schema<IGame>({
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
        type: [voteSchema],
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gameSchema.plugin(toJSON);

export const Game = mongoose.model<IGame>('Game', gameSchema); 