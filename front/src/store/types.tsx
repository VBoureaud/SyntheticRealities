// global store
export type Games = {
    [gameName: string]: Game;
}

export type Game = {
    players: string[];
    playersOut: string[];
    gameStep: string;
    totalPlayers: number;
    defaultPlayersHP: number;
    AiHP: number;
    timer: number;
    isTimerFix: boolean;
    votes: { [playerName: string]: Vote[] };
    playersHP: { [playerName: string]: number[] };
    cards: number[];
    cardsAnswer: CardAnswer[];
    maxCards: number;
    name?: string;
    score?: number;
    updatedAt?: string;
}

export type Vote = {
    stepStart: number;
    stepEnd: number;
    choice: number;
    hp: number;
}

export type CardAnswer = {
    name: string;
    isHuman: boolean;
    isAI: boolean;
}

export type CardResult = {
    id: number;
    choice: number;
}

export type Message = {
    name: string;
    gameName: string;
    action: string;
    totalPlayers?: number;
    defaultPlayersHP?: number;
    AiHP?: number;
    timer?: number;
    isTimerFix?: boolean;
    vote?: number;
    cards?: number[];
    maxCards?: number;
}

export type TypeGameContext = {
    loadingGame: boolean;
    games: Games,
    playerName: string;
    party: string;
    totalPlayers: number;
    initStore: Function;
    saveName: Function;
    synchroniseGame: Function;
    askCreateGame: Function;
    askLaunchGame: Function;
    askVoteGame: Function;
    askNextGame: Function;
    askQuitGame: Function;
    askEndGame: Function;
    handleGame: Function;
    handlePublish: Function;
}

export interface ScoreType {
    key?: number;
    playerName: string;
    time: number;
    score: number;
    date: string;
}