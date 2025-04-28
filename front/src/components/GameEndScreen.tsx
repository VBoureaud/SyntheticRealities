import { useState, useEffect } from 'react'
import { Vote, Games, Game } from "../store/types";
import { calculatorXp, calculatorHp } from "../utils";
import Confetti from 'react-confetti';

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
            <div style={{ margin: '50px 0' }} className="container">
                {/* Screen result */}
                {game && <div className="container victory-table" style={{ alignItems: 'normal' }}>
                    <div className="resultArea">
                        <div>
                            <h2 style={{ marginBottom: '0' }}>Result</h2>
                            {aiHp === playerHp && <h3 style={{ letterSpacing: '3px', fontSize: '35px', margin: '20px 0' }}>Draw !</h3>}
                            {aiHp > playerHp && <h3 style={{ 
                                letterSpacing: '3px', 
                                fontSize: '35px', 
                                margin: '20px 0',
                                animation: 'glitch 1s linear infinite',
                                textShadow: '2px 2px #ff0000, -2px -2px #00ff00',
                                textTransform: 'uppercase'
                            }}>You lost!</h3>}
                            {aiHp < playerHp && <h3 style={{ 
                                letterSpacing: '3px', 
                                fontSize: '35px', 
                                margin: '20px 0',
                                animation: 'glitch 1s linear infinite',
                                textShadow: '2px 2px #ff0000, -2px -2px #00ff00',
                                textTransform: 'uppercase'
                            }}>YOU WON!</h3>}
                        </div>
                        <div className="scoreArea">
                            <div className="resultScoreBox">
                                <p>AI HP</p>
                                <h3>{aiHp < 0 ? 0 : aiHp}</h3>
                            </div>
                            <div className="resultScoreBox">
                                <p>Player HP</p>
                                <h3>{playerHp < 0 ? 0 : playerHp}</h3>
                            </div>
                        </div>
                        <div onClick={() => props.handleClose()} className="button closeBtn" style={{ backgroundColor: 'transparent', border: '2px solid #daa520', color: '#daa520' }}>Close the game</div>
                    </div>
                    <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
                        <div style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                            {game && game.cards.map((cardId: number, index: number) => {
                                const vote = game.votes[props.playerName]?.[index];
                                return <div style={{ margin: '10px', display: 'flex' }} key={index}>
                                    <p>
                                        <span style={{ color: '#daa520', fontSize: '1.2rem', marginBottom: '10px', display: 'block' }}>Card {index + 1}</span>
                                        {vote ? <>
                                            Your answer: <b>{vote.choice + 1 === enumVote['real'] ? 'Real' : 'AI-Generated'}</b><br />
                                            you bet: <b>{vote.hp}</b><br />

                                            <span style={{ fontSize: '50px', display: 'block', lineHeight: '0', marginBottom: '20px', textAlign: 'center', color: '#2c533d' }}>.</span>
                                            It was: <b>{game.cardsAnswer[index].isHuman ? 'Real' : 'AI-Generated'}</b><br />
                                            You {vote.choice == Number(game.cardsAnswer[index].isAI) ? ' win ' : ' lost: '}<b>{calculatorXp(
                                                vote.stepStart,
                                                vote.stepEnd,
                                                vote.hp,
                                                vote.choice == Number(game.cardsAnswer[index].isAI)
                                            )}</b>
                                        </> : <span style={{ color: '#daa520' }}>Not played</span>}
                                    </p>
                                </div>
                            })}
                        </div>
                    </div>
                </div>}
            </div>
        </>
    )
}

export default GameEndScreen
