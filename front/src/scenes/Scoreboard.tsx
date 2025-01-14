import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Web2Context from "../store/web2store";
import Footer from "../components/Footer";
import GameScore from "../components/GameScore";
import { Game, Vote, ScoreType } from "../store/types";

function Scoreboard() {
    const storeWeb2 = useContext(Web2Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!storeWeb2?.scores)
            storeWeb2?.getScore();
    }, []);

    const formatData = (scores: Game[]) => {
        const scoreFormat = scores.map((game: Game) => ({
            playerName: game.name ? game.name : '',
            time: game.votes[Object.keys(game.votes)[0]].reduce((acc: number, vote: Vote) => acc + (vote.stepEnd - vote.stepStart), 0),
            score: game.score ? game.score : 0,
            date: game.updatedAt ? game.updatedAt : '',
        }))
        const scoreSorted = scoreFormat.sort((gameA: ScoreType, gameB: ScoreType) => {
            if (gameA.score > gameB.score) return -1;
            else if (gameA.score < gameB.score) return 1;
            else if (gameA.time > gameB.time) return -1;
            else if (gameA.time < gameB.time) return 1;
            return 0;
        });
        return scoreSorted.map((game: ScoreType, key: number) => ({ key, ...game }));
    }

    return (
        <>
            <div className="inner-shadow" style={{ maxWidth: '940px', margin: 'auto', paddingBottom: '30px' }}>
                <div style={{ color:'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '15px 0' }}>
                    <h2 style={{ letterSpacing: '1px', margin: 0 }}>Scoreboard</h2>
                    <button style={{ margin: 0 }} className="button closeBtn" onClick={() => navigate("/")}>Back</button>
                </div>
                {storeWeb2?.loadingScore && <p style={{ color: 'white' }}>Loading score...</p>}
                {storeWeb2?.scores
                    && <GameScore
                        data={formatData(storeWeb2.scores)}
                    />}
            </div>
            <Footer
                style={{ maxWidth: '940px', margin: 'auto' }}
                gameCount={0}
                linkToHome={() => navigate("/")}
                linkToPlay={() => navigate("/about")}
                LinkToScore={() => navigate("/score")}
                link={'https://gitlab.com/'}
            />
        </>
    )
}

export default Scoreboard
