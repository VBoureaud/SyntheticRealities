import React, { useEffect, useState, useContext } from "react";
import { makeId } from "../utils";
import * as middleware from "./middleware";
import Web2Context from "./web2store";
import { getStorage, storageData } from "./localStorage";
import { Games, TypeGameContext } from "./types";

// clarify name calls enum
export const eSteps = {
	'create': 0,
	'join': 1,
	'launchStep': 2,
	'vote': 3,
	'next': 4,
	'end': 5,
	'quit': 6,
};

// steps name
export const steps = [
	'create',
	'join',
	'launchStep',
	'vote',
	'next',
	'end',
	'quit',
];

type Props = {
	children: React.ReactNode;
};

const GameContext = React.createContext<TypeGameContext>({
	loadingGame: false,
	games: {},
	playerName: '',
	party: '',
	totalPlayers: 1,
	initStore: () => { },
	synchroniseGame: () => { },
	saveName: () => { },
	askCreateGame: middleware.askCreateGame,
	askLaunchGame: middleware.askLaunchGame,
	askVoteGame: middleware.askVoteGame,
	askNextGame: middleware.askNextGame,
	askQuitGame: middleware.askQuitGame,
	askEndGame: middleware.askEndGame,
	handleGame: middleware.handleGame,
	handlePublish: () => Boolean,
});

export const GameContextProvider = (props: Props) => {
	const [loadingGame, setLoadingGame] = useState(false);
	const [games, setGames] = useState<Games>({});
	const [playerName, setPlayerName] = useState('');
	const [party, setParty] = useState('');
	const totalPlayers = 2;
	const web2store = useContext(Web2Context);

	useEffect(() => {
		console.log({ loadingGame });
	}, [loadingGame]);

	useEffect(() => {
		if (!party && playerName) {
			const sessions = Object.keys(games);
			for (let i = 0; i < sessions.length; i++) {
				if (games[sessions[i]].players.indexOf(playerName) != -1)
					setParty(sessions[i]);
			}
		}
		else if (!games[party] && party) {
			setParty('');
		}
		else if (party && playerName && games[party]) {
			if (games[party].players.indexOf(playerName) == -1) {
				setParty('');
			}
		}
	}, [games]);

	const initStore = async () => {
		const defaultName = ('player_' + makeId(6));
		const u = await getStorage('playerName');
		await setPlayerName(u ? u : defaultName);
		await storageData('playerName', u ? u : defaultName);
	}

	const synchroniseGame = (newGame: string) => {
		if (newGame)
			setParty(newGame);
	}

	const saveName = async (newName: string) => {
		setPlayerName(newName);
		await storageData('playerName', newName);
	}

	const askCreateGame = middleware.askCreateGame;
	const askLaunchGame = middleware.askLaunchGame;
	const askVoteGame = middleware.askVoteGame;
	const askNextGame = middleware.askNextGame;
	const askQuitGame = middleware.askQuitGame;
	const askEndGame = middleware.askEndGame;
	const handleGame = middleware.handleGame;

	const handlePublish = async (message: any /*Message | Boolean*/) => {
		await setLoadingGame(true);
		console.log('publish', loadingGame, message);
		if (!message || typeof message == "boolean") {
			setLoadingGame(false);
			return false;
		}

		// websocket ably
		// if (online && channelGame && message.name) {
		// 	channelGame.channel.publish(message.name, JSON.stringify(message));
		// 	return true;
		// }
		await handleUpdate(message);
		setLoadingGame(false);
	}

	const handleUpdate = async (message: any /*Message | Boolean*/) => {
		console.log('update');
		const gameUpdated = await middleware.handleGame(
			games,
			playerName,
			message,
			web2store,
			synchroniseGame
		);
		if (!gameUpdated) return false;
		setGames(games => ({ ...games, ...gameUpdated }));
		return true;
	}

	return (
		<GameContext.Provider
			value={{
				loadingGame,
				games,
				playerName,
				party,
				totalPlayers,
				saveName,
				initStore,
				synchroniseGame,
				askCreateGame,
				askLaunchGame,
				askVoteGame,
				askNextGame,
				askQuitGame,
				askEndGame,
				handleGame,
				handlePublish,
			}}
		>
			{props.children}
		</GameContext.Provider>
	);
}


export default GameContext;