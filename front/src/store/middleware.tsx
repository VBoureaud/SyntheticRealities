import { Games } from "./types";
import { eSteps, steps, } from "./";
import { getRandomArbitrary, calculateScoreByVote, calculatorHp } from "../utils";
import config from "../config";

// generate obj to ask for a new game
export const askCreateGame = (games: Games, playerName: string, totalPlayers: number, playersHP: number, AiHP: number, timer: number, isTimerFix: boolean, maxCards: number) => {
    console.log('askCreateGame');

    // can create only one game with same name
    if (games[playerName])
        return false;

    const message = {
        'gameName': playerName,
        'action': steps[eSteps['create']],
        'name': playerName,
        'totalPlayers': totalPlayers ? totalPlayers : config.totalPlayers,
        'defaultPlayersHP': playersHP ? playersHP : config.playersHP,
        'AiHP': AiHP ? AiHP : config.AiHP,
        'timer': timer ? timer : config.timer,
        'isTimerFix': isTimerFix,
        'maxCards': maxCards ? maxCards : config.maxCards,
    };
    return message;
}

export const askLaunchGame = (games: Games, playerName: string, party: string) => {
    console.log('askLaunchGame');

    // if game exist & waiting players step & total max players & not already in
    // can be launch only by creator playerName
    const game = games[party];
    if (!game) return false;
    if (party.split('#')[0] != playerName) return false;
    if (game && game.gameStep != steps[eSteps['create']]) return false;
    if (game && game.totalPlayers !== game.players.length) return false;

    const newTime = new Date().getTime();
    const message = {
        'gameName': party,
        'action': steps[eSteps['launchStep']] + '-' + newTime,
        'name': playerName,
    };
    return message;
}

export const askVoteGame = (games: Games, playerName: string, party: string, choice: number, hp: number) => {
    console.log('askVoteGame');
    const newTime = new Date().getTime();
    // if game exist & player in game & launchStep & player hp & not already voted & valid choice
    const game = games[party];

    const currentStep = game && game.gameStep ? game.gameStep.split('-') : [];
    if (!game) return false;
    if (game.players.indexOf(playerName) === -1) return false;
    if (currentStep.length != 2 || currentStep[0] !== steps[eSteps['launchStep']]) return false;
    if (config.choices.indexOf(choice) === -1) return false;
    // check player didnt already play
    const currentStepTime = parseInt(currentStep[1]);
    if (isNaN(currentStepTime)) return false;
    let totalHp = calculatorHp(game.votes, game.cardsAnswer, game.defaultPlayersHP, false);
    if (totalHp <= 0) return false;
    /*if (game.votes[playerName]) {
        for (let i = 0; i < game.votes[playerName].length; i++)
            if (game.votes[playerName][i].stepStart === currentStepTime) { return false; }
        // check player still alive
        totalHpSpend = game.votes[playerName].map((v: Vote) => v.hp).reduce((v1: number, v2: number) => v1 + v2);
        if (game.defaultPlayersHP <= totalHpSpend) { return false; }
    }
    if (hp + totalHpSpend > game.defaultPlayersHP) {
        return false;
    }*/
    // check timer has not reached zero
    if (game.isTimerFix && newTime - currentStepTime >= game.timer + config.voteTimerTolerance) return false;
    const vote = {
        stepStart: currentStepTime,
        stepEnd: newTime,
        choice,
        hp
    };
    const message = {
        'gameName': party,
        'action': steps[eSteps['vote']],
        'name': playerName,
        'vote': vote,
    };
    return message;
}

// step next: when step + 1
export const askNextGame = (games: Games, playerName: string, party: string) => {
    console.log('askNextGame');

    // if game exist & launchStep & voted
    // can be launch only by creator playerName
    const game = games[party];
    const currentStep = game && game.gameStep ? game.gameStep.split('-') : [];
    if (!game) return false;
    if (party.split('#')[0] != playerName) return false;
    if (game && currentStep[0] != steps[eSteps['launchStep']]) return false;
    if (!game.votes[playerName]) return false;
    // all players voted
    for (let i = 0; i < game.players.length; i++) {
        if (!game.votes[game.players[i]]) return false;
        if (game.votes[game.players[i]].length != game.cards.length) return false;
    }

    // cond vict / loss && check
    // ask server answer - todo
    const serverAnswer = [];
    for (let i = 0; i < game.cards.length; i++) {
        serverAnswer.push({
            id: game.cards[i],
            choice: config.choices[0],
        });
    }

    // if multiplayer - todo
    // for (let i = 0; i < game.players.length; i++) {}

    // check hp player
    const playerCurrentHp = game.defaultPlayersHP + calculateScoreByVote(game.votes[playerName], game.cards, serverAnswer);

    let message;
    if (playerCurrentHp > 0 && (game.maxCards > 0 && game.cards.length < game.maxCards)) {
        // ask server new card server.newCard([previousCards])
        //const newItem = parseInt(getRandomArbitrary(0, config.imagesNumber) + '');
        const newTime = new Date().getTime();
        message = {
            'gameName': party,
            'action': steps[eSteps['launchStep']] + '-' + newTime,
            'name': playerName,
            //'card': newItem,
        };
    } else {
        message = {
            'gameName': party,
            'action': steps[eSteps['end']],
            'name': playerName,
        };
    }
    return message;
}

export const askEndGame = (games: Games, playerName: string, party: string) => {
    console.log('askEndGame');

    // if game exist & player In
    const game = games[party];
    // const currentStep = game && game.gameStep ? game.gameStep.split('-') : [];
    if (!game) return false;
    if (game.players.indexOf(playerName) === -1) return false;
    if (game.playersOut.indexOf(playerName) !== -1) return false;

    const message = {
        'gameName': party,
        'action': steps[eSteps['end']],
        'name': playerName,
    };
    return message;
}

export const askQuitGame = (games: Games, playerName: string, party: string) => {
    console.log('askQuitGame');

    // if game exist & player In
    const game = games[party];
    // const currentStep = game && game.gameStep ? game.gameStep.split('-') : [];
    if (!game) return false;
    if (game.players.indexOf(playerName) === -1) return false;
    if (game.playersOut.indexOf(playerName) !== -1) return false;

    const message = {
        'gameName': party,
        'action': steps[eSteps['quit']],
        'name': playerName,
    };
    return message;
}

export const handleGame = async (
    games: Games,
    playerName: string,
    message?: any /*Message*/,
    web2store?: any,
    synchroniseGame?: Function,
) => {
    if (playerName) playerName;
    const previousState = games;
    if (message
        && !previousState[message.gameName]
        && message.action === steps[eSteps['create']]) {
        let gameName = message.gameName;
        if (web2store && config.online) {
            const res = await web2store.createGame({
                name: message.gameName,
                players: [message.name],
                AiHp: message.AiHP,
                defaultPlayersHP: message.defaultPlayersHP,
                timer: message.timer,
                isTimerFix: message.isTimerFix,
                maxCards: message.maxCards ? message.maxCards : config.maxCards,
            });
            if (!res) return false;
            if (synchroniseGame) synchroniseGame(res.game.name);
            gameName = res.game.name;
        }
        previousState[gameName] = {
            players: [message.name],
            playersOut: [],
            gameStep: steps[eSteps['create']],
            totalPlayers: message.totalPlayers,
            defaultPlayersHP: message.defaultPlayersHP,
            AiHP: message.AiHP,
            timer: message.timer,
            isTimerFix: message.isTimerFix,
            votes: {},
            playersHP: {},
            cards: [],
            cardsAnswer: [],
            maxCards: message.maxCards ? message.maxCards : config.maxCards,
        }
        previousState[gameName].playersHP[message.name] = message.defaultPlayersHP;
    }
    else if (message
        && message.action.split('-')[0] == steps[eSteps['launchStep']]) {
        // get a new card from server
        let newItem;
        if (web2store && config.online) {
            const res = await web2store.getCard({
                partyName: message.gameName,
            });
            if (!res && res !== 0) return false;
            newItem = parseInt(res);
        } else newItem = parseInt(getRandomArbitrary(0, config.imagesNumber) + '');

        previousState[message.gameName] = {
            ...previousState[message.gameName],
            gameStep: message.action,
            cards: [...previousState[message.gameName].cards, newItem],
        }
    }
    else if (message
        && message.vote != undefined && message.action == steps[eSteps['vote']]) {
        if (web2store && config.online) {
            const res = await web2store.updateGame({
                partyName: message.gameName,
                votes: {
                    playerName: message.name,
                    ...message.vote,
                }
            });
            if (!res) return false;
            // todo - when multiplayer check all vote ok
            const res2 = await web2store.getCardDetail({
                partyName: message.gameName,
                name: games[message.gameName] ? games[message.gameName].cards[games[message.gameName].cards.length - 1] : '',
            });
            if (!res2) return false;
            previousState[message.gameName].cardsAnswer = [
                ...previousState[message.gameName].cardsAnswer,
                res2
            ];
        }

        let newVotes = [];
        if (previousState[message.gameName].votes[message.name])
            newVotes = [
                ...previousState[message.gameName].votes[message.name],
                message.vote
            ];
        else {
            newVotes = [message.vote];
        }
        previousState[message.gameName].votes[message.name] = newVotes;
        // /!\ we dont change game.gameStep
    }
    else if (message
        && message.action === steps[eSteps['end']]) {
        previousState[message.gameName] = {
            ...previousState[message.gameName],
            gameStep: message.action,
        }
    }
    else if (message
        && message.action === steps[eSteps['quit']]) {
        const previousPlayers = previousState[message.gameName].players;
        previousPlayers.splice(previousPlayers.indexOf(message.name), 1);
        // previousState[message.gameName] = {
        //     ...previousState[message.gameName],
        //     players: previousPlayers,
        //     playersOut: [...previousState[message.gameName].playersOut, message.name],
        //     gameStep: message.action,
        // }

        delete previousState[message.gameName];
        // todo send to server if all playersOut
    }
    else {
        return false;
    }
    return previousState;
}
