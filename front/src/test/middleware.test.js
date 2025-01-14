const middleware = require('../store/middleware');
const { steps, eSteps } = require('../store');
const { clone } = require('../utils');
const config = require('../config');

const simpleGame = {
    'player_test1#1': {
        players: ['player_test1'],
        playersOut: [],
        gameStep: steps[eSteps['create']],
        totalPlayers: config.default.totalPlayers,
        defaultPlayersHP: config.default.playersHP,
        AiHP: config.default.AiHP,
        timer: config.default.timer,
        isTimerFix: config.default.isTimerFix,
        votes: {},
        playersHP: { 'player_test1': config.default.playersHP },
        cards: [],
        cardsAnswer: [],
        maxCards: 10,
    }
};

test('askCreateGame simple game', () => {
    const games = {};
    const playerName = "player_test1";
    const partyCounter = 1;
    const result = {
        'gameName': playerName,
        'action': steps[eSteps['create']],
        'name': playerName,
        'totalPlayers': config.default.totalPlayers,
        'defaultPlayersHP': config.default.playersHP,
        'AiHP': config.default.AiHP,
        'timer': config.default.timer,
        'isTimerFix': config.default.isTimerFix,
        'maxCards': config.default.maxCards,
    };

    const message = middleware.askCreateGame(
        games,
        playerName,
        config.default.totalPlayers,
        config.default.playersHP,
        config.default.AiHP,
        config.default.timer,
        config.default.isTimerFix,
        config.default.maxCards
    );
    expect(message).toStrictEqual(result);
});

test('askCreateGame already launched', () => {
    const games = { ...simpleGame };
    const partyName = "player_test1#1";
    const result = false;

    const newGame = middleware.askCreateGame(
        games,
        partyName,
        config.default.totalPlayers,
        config.default.playersHP,
        config.default.AiHP,
        config.default.timer,
        config.default.isTimerFix,
        config.default.maxCards
    );
    expect(newGame).toStrictEqual(result);
});

test('askCreateGame simple game and handleGame', async () => {
    const games = {};
    const playerName = "player_test1";
    const expectGame = clone(simpleGame);
    const partyCounter = 1;
    const gameName = playerName + '#' + partyCounter;
    const message = middleware.askCreateGame(
        games,
        playerName,
        config.default.totalPlayers,
        config.default.playersHP,
        config.default.AiHP,
        config.default.timer,
        config.default.isTimerFix,
        config.default.maxCards,
    );
    const updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );
    expect(updatedGames[playerName].cards).toHaveLength(0);
    expectGame[gameName].cards = updatedGames[playerName].cards;
    //expect(updatedGames).toStrictEqual(expectGame);
});

test('askLaunchGame simple', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const partyCounter = 1;
    const party = playerName + '#' + partyCounter;
    const result = {
        'gameName': party,
        'action': steps[eSteps['launch']],
        'name': playerName,
    };

    const newAsk = middleware.askLaunchGame(games, playerName, party);
    expect(newAsk.action.split('-')).toHaveLength(2);
    newAsk.action = steps[eSteps['launch']];
    expect(newAsk).toStrictEqual(result);
});

test('askLaunchGame not your game', () => {
    const games = clone(simpleGame);
    const playerName = "player_test2";
    const party = "player_test1";
    const result = false;

    const newAsk = middleware.askLaunchGame(games, playerName, party);
    expect(newAsk).toStrictEqual(result);
});

test('askLaunchGame simple and handleGame', async () => {
    const games = clone(simpleGame);
    const expectGame = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const currentCardsNb = games[gameName].cards.length;
    const message = middleware.askLaunchGame(
        games,
        playerName,
        gameName);
    //newAsk.action = steps[eSteps['launch']];
    const updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );

    expect(updatedGames[gameName].gameStep.split('-')).toHaveLength(2);
    expect(updatedGames[gameName].cards.length).toStrictEqual(currentCardsNb + 1);
    updatedGames[gameName].gameStep = steps[eSteps['launchStep']];
    expectGame[gameName].gameStep = steps[eSteps['launchStep']];
    expectGame[gameName].cards = updatedGames[gameName].cards;
    expect(updatedGames).toStrictEqual(expectGame);
});

test('askVoteGame ok', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = config.default.choices[0];
    const newTime = new Date().getTime();
    const resultExpected = {
        gameName: gameName,
        action: steps[eSteps['vote']],
        name: playerName,
        vote: {
            stepStart: newTime,
            stepEnd: 0,
            choice,
            hp
        }
    };
    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newTime;
    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);
    message.vote.stepEnd = 0;

    expect(message).toStrictEqual(resultExpected);
});

test('askVoteGame timer limit fail', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();
    const newStart = parseInt(newTime) - parseInt(config.default.timer) - config.voteTimerTolerance;
    const resultExpected = false;

    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newStart;
    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);

    expect(message).toStrictEqual(resultExpected);
});

test('askVoteGame timer limit fail but not a problem', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();
    const newStart = parseInt(newTime) - parseInt(config.default.timer) - config.default.voteTimerTolerance;

    const resultExpected = {
        gameName: gameName,
        action: steps[eSteps['vote']],
        name: playerName,
        vote: {
            stepStart: newTime,
            stepEnd: 0,
            choice,
            hp
        }
    };

    games[gameName].isTimerFix = false;
    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newStart;
    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);
    message.vote.stepStart = newTime;
    message.vote.stepEnd = 0;

    expect(message).toStrictEqual(resultExpected);
});

test('askVoteGame bad choice', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0] + 10;
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();
    const resultExpected = false;

    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newTime;
    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);

    expect(message).toStrictEqual(resultExpected);
});

test('askVoteGame not more hp', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();
    const resultExpected = false;

    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newTime;
    games[gameName].votes[playerName] = [
        {
            stepStart: newTime - config.default.timer * 3,
            stepEnd: newTime - config.default.timer * 2,
            choice: config.default.choices[0],
            hp: parseInt(config.default.playersHP / 2),
        }, {
            stepStart: newTime - config.default.timer * 2,
            stepEnd: newTime - config.default.timer * 1,
            choice: config.default.choices[1],
            hp: parseInt(config.default.playersHP / 2),
        }
    ];
    games[gameName].cardsAnswer = [
        {
            isAI: true,
            isHuman: false,
            name: "67"
        }, {
            isAI: false,
            isHuman: true,
            name: "75"
        }
    ];

    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);

    expect(message).toStrictEqual(resultExpected);
});


test('askVoteGame add last vote', () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = 1;
    const newTime = new Date().getTime();
    const voteList = [
        {
            stepStart: newTime - config.default.timer * 3,
            stepEnd: newTime - config.default.timer * 2,
            choice: config.default.choices[0],
            hp: parseInt(config.default.playersHP / 2),
        }, {
            stepStart: newTime - config.default.timer * 2,
            stepEnd: newTime - config.default.timer * 1,
            choice: config.default.choices[0],
            hp: parseInt(config.default.playersHP / 2) - 1,
        }
    ];
    const resultExpected = {
        'gameName': gameName,
        'action': steps[eSteps['vote']],
        'name': playerName,
        'vote': {
            stepStart: newTime,
            stepEnd: 0,
            choice,
            hp,
        },
    };

    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newTime;
    games[gameName].votes[playerName] = voteList;
    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);
    message.vote.stepEnd = 0;
    expect(message).toStrictEqual(resultExpected);
});

test('askVoteGame simple and handleGame', async () => {
    const games = clone(simpleGame);
    const expectGame = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();

    games[gameName].gameStep = steps[eSteps['launchStep']] + '-' + newTime;
    const message = middleware.askVoteGame(
        games,
        playerName,
        gameName,
        choice,
        hp);
    const updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );
    const voteList = [
        {
            stepStart: 0,
            stepEnd: 0,
            choice,
            hp,
        },
    ];

    expectGame[gameName].votes[playerName] = voteList;
    updatedGames[gameName].votes[playerName][0].stepStart = 0;
    updatedGames[gameName].votes[playerName][0].stepEnd = 0;
    expect(updatedGames[gameName].gameStep.split('-')).toHaveLength(2);
    updatedGames[gameName].gameStep = steps[eSteps['launchStep']];
    expectGame[gameName].gameStep = steps[eSteps['launchStep']];
    expect(updatedGames).toStrictEqual(expectGame);
});

test('askNextGame and handleGame after voted', async () => {
    let games = clone(simpleGame);
    const expectGame = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();

    // launchStep
    let message, updatedGames;
    message = middleware.askLaunchGame(
        games,
        playerName,
        gameName);
    updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );

    // vote
    message = middleware.askVoteGame(
        updatedGames,
        playerName,
        gameName,
        choice,
        hp);
    updatedGames = await middleware.handleGame(
        updatedGames,
        playerName,
        message,
    );

    // next
    message = middleware.askNextGame(
        updatedGames,
        playerName,
        gameName);
    const messageExpected = {
        'gameName': gameName,
        'action': steps[eSteps['launchStep']],
        'name': playerName,
    };
    expect(message.action.split('-')).toHaveLength(2);
    messageExpected.action = message.action;
    expect(message).toStrictEqual(messageExpected);

    updatedGames = await middleware.handleGame(
        updatedGames,
        playerName,
        message,
    );
    expect(updatedGames[gameName].gameStep.split('-')).toHaveLength(2);
    expect(updatedGames[gameName].cards).toHaveLength(2);
    expect(updatedGames[gameName].votes[playerName].length).toStrictEqual(1);
});

test('askNextGame but no vote', async () => {
    let games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();
    const resultExpected = false;

    // launchStep
    let message, updatedGames;
    message = middleware.askLaunchGame(
        games,
        playerName,
        gameName);
    updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );

    // next
    message = middleware.askNextGame(
        updatedGames,
        playerName,
        gameName);
    expect(message).toStrictEqual(resultExpected);
});

test('askNextGame but end of game', async () => {
    let games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const choice = config.default.choices[0];
    const hp = parseInt(config.default.playersHP / 10);
    const newTime = new Date().getTime();

    // launchStep
    let message, updatedGames;
    games[gameName].maxCards = 1;
    message = middleware.askLaunchGame(
        games,
        playerName,
        gameName);
    updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );

    // vote
    message = middleware.askVoteGame(
        updatedGames,
        playerName,
        gameName,
        choice,
        hp);
    updatedGames = await middleware.handleGame(
        updatedGames,
        playerName,
        message,
    );

    // next
    message = middleware.askNextGame(
        updatedGames,
        playerName,
        gameName);
    const resultExpected = {
        action: steps[eSteps['end']],
        gameName: gameName,
        name: playerName,
    };

    expect(message).toStrictEqual(resultExpected);

    updatedGames = await middleware.handleGame(
        updatedGames,
        playerName,
        message,
    );
    expect(updatedGames[gameName].gameStep).toStrictEqual(steps[eSteps['end']]);
    expect(updatedGames[gameName].cards).toHaveLength(1);
    expect(updatedGames[gameName].votes[playerName].length).toStrictEqual(1);
});

test('askQuitGame simple', async () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    const expectGame = {};

    message = middleware.askQuitGame(
        games,
        playerName,
        gameName);
    const resultExpected = {
        action: steps[eSteps['quit']],
        gameName: gameName,
        name: playerName,
    };
    expect(message).toStrictEqual(resultExpected);

    // delete the current game
    const updatedGames = await middleware.handleGame(
        games,
        playerName,
        message,
    );

    expect(updatedGames).toStrictEqual(expectGame);
});

test('askQuitGame already quit', async () => {
    let games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;
    games[gameName].players = [];
    games[gameName].playersOut = [playerName];

    message = middleware.askQuitGame(
        games,
        playerName,
        gameName);
    const resultExpected = false;
    expect(message).toStrictEqual(resultExpected);
});


test('askEndGame simple', async () => {
    const games = clone(simpleGame);
    const playerName = "player_test1";
    const party = "player_test1";
    const partyCounter = 1;
    const gameName = party + '#' + partyCounter;

    message = middleware.askEndGame(
        games,
        playerName,
        gameName);
    const resultExpected = {
        action: steps[eSteps['end']],
        gameName: gameName,
        name: playerName,
    };
    expect(message).toStrictEqual(resultExpected);

    const updatedGames = await middleware.handleGame(
        games,
        gameName,
        message,
    );

    expect(updatedGames[gameName].gameStep).toStrictEqual(steps[eSteps['end']]);
});
