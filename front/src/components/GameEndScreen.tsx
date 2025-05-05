import { useState, useEffect } from 'react'
import { Vote, Games, Game } from "../store/types";
import { calculatorXp, calculatorHp } from "../utils";
import Confetti from 'react-confetti';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import imageList from "./imageList";
import styles from './gameEndScreen.module.css';

type Props = {
    playerName: string;
    handleClose: Function;
    handleWin: Function;
    games: Games;
    party: string;
}

const enumVote: { [key: string]: number } = {
    'init': 0,
    'real': 1,
    'ai-generated': 2,
};

function GameEndScreen(props: Props) {
    const [game, setGame] = useState<Game>();
    const [aiHp, setAiHp] = useState(0);
    const [playerHp, setPlayerHp] = useState(0);

    useEffect(() => {
        if (game) {
            const ai = calculatorHp(game.votes, game.cardsAnswer, game.AiHP, true);
            const p = calculatorHp(game.votes, game.cardsAnswer, game.defaultPlayersHP, false);
            if (ai <= 0 && p > 0) props.handleWin();
            setAiHp(ai);
            setPlayerHp(p);
        }
    }, [game]);

    useEffect(() => {
        if (game)
            setGame(game => ({ ...game, ...props.games[props.party] }));
        else
            setGame(props.games[props.party]);
    }, [props.games]);

    return (
        <>
            {aiHp <= 0 && playerHp > 0 && <Confetti recycle={false} />}
            <div className={styles.container}>
                {/* Screen result */}
                {game && <div className={`${styles.container} ${styles.victoryTable}`}>
                    <div className={styles.resultArea}>
                        <div>
                            <h2 className={styles.resultTitle}>Result</h2>
                            {aiHp === playerHp && <h3 className={styles.drawText}>Draw !</h3>}
                            {aiHp > playerHp && <h3 style={{ animation: 'glitch 1s linear infinite' }} className={styles.lostText}>You lost!</h3>}
                            {aiHp < playerHp && <h3 style={{ animation: 'glitch 1s linear infinite' }} className={styles.wonText}>YOU WON!</h3>}
                        </div>
                        <div className={styles.scoreArea}>
                            <div className={styles.resultScoreBox}>
                                <p>AI HP</p>
                                <h3>{aiHp < 0 ? 0 : aiHp}</h3>
                            </div>
                            <div className={styles.resultScoreBox}>
                                <p>Player HP</p>
                                <h3>{playerHp < 0 ? 0 : playerHp}</h3>
                            </div>
                        </div>
                        <div onClick={() => props.handleClose()} className={`button ${styles.closeButton}`}>Close the game</div>
                    </div>
                    <div className={styles.cardsContainer}>
                        <div className={styles.cardsWrapper}>
                            <PhotoProvider>
                                {game && game.cards.map((cardId: number, index: number) => {
                                    const vote = game.votes[props.playerName]?.[index];
                                    return <div className={styles.cardItem} key={index}>
                                            <div>
                                                <PhotoView src={imageList[game.cards[index] - 1]}>
                                                    <span style={{ backgroundImage: 'url(' + imageList[game.cards[index] - 1] + ')' }} className={`number-card-result ${styles.cardNumber}`}></span>
                                                </PhotoView>
                                            </div>
                                            <div className={styles.cardInfo}>
                                                {vote ? <>
                                                    <span className={styles.cardTitle}>Card {index + 1}</span>
                                                    Your answer: <b>{vote.choice + 1 === enumVote['real'] ? 'Real' : 'AI-Generated'}</b><br />
                                                    you bet: <b>{vote.hp}</b><br />

                                                    <span className={styles.separator}>.</span>
                                                    It was: <b>{game.cardsAnswer[index].isHuman ? 'Real' : 'AI-Generated'}</b><br />
                                                    You {vote.choice == Number(game.cardsAnswer[index].isAI) ? ' win ' : ' lost: '}<b>{calculatorXp(
                                                        vote.stepStart,
                                                        vote.stepEnd,
                                                        vote.hp,
                                                        vote.choice == Number(game.cardsAnswer[index].isAI)
                                                    )}</b>
                                                </> : <span className={styles.notPlayed}>Not played</span>}
                                            </div>
                                    </div>
                                })}
                            </PhotoProvider>
                        </div>
                    </div>
                </div>}
            </div>
        </>
    )
}

export default GameEndScreen
