const middleware = require('../store/middleware_multiplayer');
const { steps, eSteps } = require('../store');
const { clone } = require('../utils');
const config = require('../config');

const simpleGame = {
    'player-test1': {
        players: ['player-test1'],
        playersOut: [],
        totalPlayers: config.default.totalPlayers,
        step: 0,
        totalSteps: config.default.totalSteps,
        votes: {},
        cards: [],
    }
};

test('createGame simple', () => {
    const games = {};
    const playerName = "player-test";
    const result = {
        'gameName': playerName,
        'action': steps[eSteps['create']],
        'name': playerName,
        'cards': [],
    };

    const newGame = middleware.createGame(games, playerName, config.default.totalSteps);
    expect(newGame.cards).toHaveLength(config.default.totalSteps);
    newGame.cards = [];
    expect(newGame).toStrictEqual(result);
});

test('createGame duplicated', () => {
    const games = { 'player-test': {} };
    const playerName = "player-test";
    const result = false;

    expect(middleware.createGame(games, playerName)).toStrictEqual(result);
});

test('joinGame simple', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const result = {
        'gameName': party,
        'action': steps[eSteps['join']],
        'name': playerName,
    };

    expect(middleware.joinGame(games, playerName, party)).toStrictEqual(result);
});

test('joinGame when duplicate', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const result = false;
    games[party].players = [...games[party].players, playerName];

    expect(middleware.joinGame(games, playerName, party)).toStrictEqual(result);
});

test('joinGame when full', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const result = false;
    games[party].totalPlayers = 1;

    expect(middleware.joinGame(games, playerName, party)).toStrictEqual(result);
});

test('joinGame when already in other party', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const party2 = "player-test2";
    const result = false;
    games[party].totalPlayers = 1;
    games[party2] = clone(simpleGame[party]);

    expect(middleware.joinGame(games, playerName, party)).toStrictEqual(result);
});

test('launchGame simple', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const result = {
        'gameName': party,
        'action': steps[eSteps['launch']],
        'name': playerName,
    };
    games[party].players = [playerName];
    games[party].totalPlayers = 1;

    expect(middleware.launchGame(games, playerName, party)).toStrictEqual(result);
});

test('launchGame when not owner', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const result = false;
    games[party].players = [playerName];
    games[party].totalPlayers = 1;

    expect(middleware.launchGame(games, playerName, party)).toStrictEqual(result);
});

test('voteGame simple', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const vote = 1;
    const result = {
        'gameName': party,
        'action': steps[eSteps['vote']],
        'name': playerName,
        'vote': 1,
    };
    games[party].players = [playerName];
    games[party].totalPlayers = 1;
    games[party].step = 1;

    expect(middleware.voteGame(games, playerName, party, vote)).toStrictEqual(result);
});

test('voteGame when already, step 1', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const votes = {};
    votes[playerName] = [1];
    const result = false;
    games[party].players = [playerName];
    games[party].totalPlayers = 1;
    games[party].step = 1;
    games[party].votes = votes;

    expect(middleware.voteGame(games, playerName, party, votes)).toStrictEqual(result);
});

test('voteGame when already, step 3', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const votes = {};
    votes[playerName] = [1, 0, 4];
    const result = false;
    games[party].players = [playerName];
    games[party].totalPlayers = 1;
    games[party].step = 3;
    games[party].votes = votes;

    expect(middleware.voteGame(games, playerName, party, votes)).toStrictEqual(result);
});

test('nextStep simple', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const votes = {};
    votes[playerName] = [1, 2, 3, 4];
    const result = {
        'gameName': party,
        'action': steps[eSteps['next']],
        'name': playerName,
    };
    games[party].players = [playerName];
    games[party].totalPlayers = 1;
    games[party].votes = votes;
    games[party].step = games[party].totalSteps - 1;

    expect(middleware.nextStep(games, playerName, party)).toStrictEqual(result);
});

test('nextStep when not voted', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const votes = {};
    const result = false;
    games[party].players = [playerName];
    games[party].totalPlayers = 1;
    games[party].votes = votes;
    games[party].step = games[party].totalSteps - 1;

    expect(middleware.nextStep(games, playerName, party)).toStrictEqual(result);
});

test('endGame simple', () => {
    const games = clone(simpleGame);
    const playerName = "player-test1";
    const party = "player-test1";
    const result = {
        'gameName': party,
        'action': steps[eSteps['end']],
        'name': playerName,
    };

    expect(middleware.endGame(games, playerName, party)).toStrictEqual(result);
});

test('endGame when not owner', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const result = false;

    expect(middleware.endGame(games, playerName, party)).toStrictEqual(result);
});

test('handleGame when create', () => {
    const games = {};
    const playerName = "player-test1";
    const expectGame = clone(simpleGame);
    const party = "player-test1";
    const message = middleware.createGame(games, playerName);
    const updatedGames = middleware.handleGame(
        games,
        playerName,
        message,
        5,
        5,
    );
    expect(updatedGames).toStrictEqual(expectGame);
});

test('handleGame when join', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const message = middleware.joinGame(games, playerName, party);
    const result = clone(simpleGame);
    result[party].players = [...result[party].players, playerName];
    const updatedGames = middleware.handleGame(
        games,
        playerName,
        message,
        5,
        5,
    );
    expect(updatedGames).toStrictEqual(result);
});

test('handleGame when launch', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    games[party].totalPlayers = 2;
    games[party].players = [...games[party].players, playerName];

    const message = middleware.launchGame(games, party);
    const updatedGames = middleware.handleGame(
        games,
        playerName,
        message,
        5,
        5,
    );
    const result = games;
    result[party].step = 1;

    expect(updatedGames).toStrictEqual(result);
});


test('handleGame when vote', () => {
    const games = clone(simpleGame);
    const playerName = "player-test2";
    const party = "player-test1";
    const vote = 2;
    games[party].totalPlayers = 2;
    games[party].players = [...games[party].players, playerName];
    games[party].step = 1;

    const message = middleware.voteGame(games, playerName, party, vote);
    const updatedGames = middleware.handleGame(
        games,
        playerName,
        message,
    );
    const result = games;
    result[party].votes[playerName] = [vote];

    expect(updatedGames).toStrictEqual(result);
});

test('handleGame when next', () => {
    const games = clone(simpleGame);
    const playerName1 = "player-test1";
    const playerName2 = "player-test2";
    const party = "player-test1";
    const vote = 2;
    games[party].totalPlayers = 2;
    games[party].players = [...games[party].players, playerName2];
    games[party].step = 1;
    games[party].votes[playerName2] = [1];
    games[party].votes[party] = [2];
    const message = middleware.nextStep(games, playerName1, party);
    const updatedGames = middleware.handleGame(
        games,
        playerName1,
        message,
    );
    const result = games;
    result[party].step = 2;

    expect(updatedGames).toStrictEqual(result);
});

test('handleGame when end', () => {
    const games = clone(simpleGame);
    const playerName1 = "player-test1";
    const playerName2 = "player-test2";
    const party = "player-test1";
    games[party].totalPlayers = 2;
    games[party].players = [...games[party].players, playerName2];
    games[party].step = 1;
    games[party].votes[playerName2] = [1];
    games[party].votes[party] = [2];
    const message = middleware.endGame(games, playerName1, party);
    const updatedGames = middleware.handleGame(
        games,
        playerName1,
        message,
    );
    const result = {};

    expect(updatedGames).toStrictEqual(result);
});

test('quitGame when ok', () => {
    const games = clone(simpleGame);
    const playerName1 = "player-test1";
    const playerName2 = "player-test2";
    const party = "player-test1";
    games[party].players = [...games[party].players, playerName2];
    const message = middleware.quitGame(games, playerName2, party);
    const updatedGames = middleware.handleGame(
        games,
        playerName1,
        message,
    );
    const result = clone(simpleGame);
    result[party].players = [playerName1];
    result[party].playersOut = [playerName2];

    expect(updatedGames).toStrictEqual(result);
});

test('quitGame when nok', () => {
    const games = clone(simpleGame);
    const playerName1 = "player-test1";
    const playerName2 = "player-test2";
    const party = "player-test1";
    const message = middleware.quitGame(games, playerName2, party);
    const updatedGames = middleware.handleGame(
        games,
        playerName1,
        message,
    );
    const result = false;

    expect(updatedGames).toStrictEqual(result);
});

