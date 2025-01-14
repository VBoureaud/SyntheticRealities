import React, { useEffect, useState } from "react";
import { buildRequest } from "../utils";
import { apiServer } from "../config";
import { Game } from "./types";

type TypeContext = {
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingCard: boolean;
    loadingDetail: boolean;
    loadingScore: boolean;
    error: string;
    createGame: Function;
    updateGame: Function;
    getCard: Function;
    getCardDetail: Function;
    getScore: Function;
    scores: Game[] | null;
};

const Web2Context = React.createContext<TypeContext | null>({
    loadingCreate: false,
    loadingUpdate: false,
    loadingCard: false,
    loadingDetail: false,
    loadingScore: false,
    error: '',
    scores: null,
    createGame: () => { },
    updateGame: () => { },
    getCard: () => { },
    getCardDetail: () => { },
    getScore: () => { },
});

type Props = {
    children: React.ReactNode;
};

export const Web2ContextProvider = (props: Props) => {
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingCard, setLoadingCard] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingScore, setLoadingScore] = useState(false);
    const [error, setError] = useState('');
    const [scores, setScores] = useState(null);
    let timerError: ReturnType<typeof setTimeout>;

    useEffect(() => {
        if (timerError)
            clearTimeout(timerError);

        if (error) {
            timerError = setTimeout(() => {
                setError('');
            }, 4000);
        }

        return () => clearTimeout(timerError);
    }, [error]);

    const createGame = async (data: any) => {
        console.log("createGame");
        try {
            setLoadingCreate(true);
            const rsp = await buildRequest(
                apiServer.newGame.url,
                apiServer.newGame.method,
                data
            );
            setLoadingCreate(false);
            return rsp;
        } catch (e) {
            console.log({ e });
            setError('Game creation failed');
        }
    }

    const updateGame = async (data: any) => {
        console.log("updateGame");
        try {
            setLoadingUpdate(true);
            const gameName = data.partyName;
            delete data.partyName;
            const rsp = await buildRequest(
                apiServer.updateGame.url + encodeURIComponent(gameName),
                apiServer.updateGame.method,
                data
            );
            setLoadingUpdate(false);
            return rsp;
        } catch (e) {
            console.log({ e });
            setError('Game update failed');
        }
    }

    const getCard = async (data: any) => {
        console.log("getCard");
        try {
            setLoadingCard(true);
            const rsp = await buildRequest(
                apiServer.getCard.url + encodeURIComponent(data.partyName),
                apiServer.getCard.method
            );
            setLoadingCard(false);
            return rsp;
        } catch (e) {
            console.log({ e });
            setError('Unable to get new card...');
        }
    }

    const getCardDetail = async (data: any) => {
        console.log("getCardDetail");
        try {
            setLoadingDetail(true);
            const rsp = await buildRequest(
                apiServer.getCardDetail.url + encodeURIComponent(data.partyName) + '/' + data.name,
                apiServer.getCardDetail.method,
            );
            setLoadingDetail(false);
            return rsp;
        } catch (e) {
            console.log({ e });
            setError('Unable to get card detail...');
        }
    }

    const getScore = async () => {
        console.log("getScore");
        try {
            setLoadingScore(true);
            const rsp = await buildRequest(
                apiServer.allGamesScore.url,
                apiServer.allGamesScore.method,
            );
            setScores(rsp);
            setLoadingScore(false);
            return rsp;
        } catch (e) {
            console.log({ e });
            setError('Unable to get scores...');
        }
    }

    return (
        <Web2Context.Provider
            value={{
                loadingCreate,
                loadingUpdate,
                loadingCard,
                loadingDetail,
                loadingScore,
                error,
                scores,
                createGame,
                updateGame,
                getCard,
                getCardDetail,
                getScore,
            }}>
            {props.children}
        </Web2Context.Provider>
    )
}

export default Web2Context;