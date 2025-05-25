import { useState, useEffect } from "react"
import { Games, Game } from "../store/types";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Progress } from "antd";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { positifNumberOrZero, calculatorXp, findStrInArray } from "../utils";
import config from "../config";
import styles from "./gameboard.module.css";
import "react-photo-view/dist/react-photo-view.css";

import Card from "./Card";
import imageList from "./imageList";
import DisplayPlayers from "./DisplayPlayers";

type Props = {
  loading: boolean;
  playerName: string;
  handleClose: Function;
  handleVote: Function;
  handleNext: Function;
  handleEnd: Function;
  games: Games;
  party: string;
  maxHp: number;
}

const enumVote: { [key: string]: number } = {
  'result': -1,
  'init': 0,
  'real': 1,
  'ai-generated': 2,
};

function GameBoard(props: Props) {
  const [game, setGame] = useState<Game>();
  const [vote, setVote] = useState(enumVote['init']);
  const [card, setCard] = useState(0);
  const [hp, setHp] = useState(50);
  const [AIHp, setAIHp] = useState(config.AiHP);
  const [playerHp, setPlayerHp] = useState(config.playersHP);
  const [isNewStep, setIsNewStep] = useState(false);
  const [timeToAnswer, setTimeToAnswer] = useState(0);
  //let timerFuncVote: ReturnType<typeof setTimeout>;
  let timerFuncExpiration: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (game) {
      if (game.cards.length != props.games[props.party].cards.length && game.gameStep.split('-').length > 1) {
        // reset vote & hp for new step
        console.log('init');
        setVote(enumVote['init']);
        const maxHp = Math.min(config.hpChooseMax, playerHp);
        setHp(Math.max(config.hpChooseMin, Math.floor(maxHp / 2)));
        setTimeToAnswer(props.games[props.party].timer);
      }
      setGame(game => ({ ...game, ...props.games[props.party] }));
    }
    else {
      // init
      setGame(props.games[props.party]);
      handleTimer(
        props.games[props.party].timer,
        props.games[props.party].gameStep.split('-')[1]);
      setIsNewStep(true);
    }

    if (props.games[props.party] && !card)
      setCard(props.games[props.party].cards[props.games[props.party].cards.length - 1]);
  }, [props.games]);

  useEffect(() => {
    if (game
      && game.gameStep.split('-').length != 1
      && game.votes[props.playerName]
      && vote !== enumVote['result']
      && game.votes[props.playerName][game.votes[props.playerName].length - 1].stepStart != parseInt(game.gameStep.split('-')[1])) {
      // new timer
      handleTimer(game.timer, game.gameStep.split('-')[1]);
      setIsNewStep(true);
    }

    // check if all votes done
    if (game) {
      let stepIsDone = true;
      for (let i = 0; i < game.players.length; i++) {
        const p = game.players[i];
        if (!game.votes[p]) stepIsDone = false;
        if (game.votes[p] && game.votes[p].length != game.cards.length) {
          stepIsDone = false;
        }
      }

      /*if (timerFuncVote && stepIsDone)
        clearTimeout(timerFuncVote);*/

      if (stepIsDone) {
        console.log('stepIsDone - request details + new card', vote, hp, game);
        setIsNewStep(false);
        setVote(enumVote['result']);
        /*timerFuncVote = setTimeout(() => {
          // show the result
        }, 150);*/
      }

    }
    //return () => clearTimeout(timerFuncVote);
  }, [game]);

  useEffect(() => {
    if (vote === enumVote['init'] || vote === enumVote['result']) return;
    handleVote();
  }, [vote]);

  useEffect(() => {
    if (timerFuncExpiration)
      clearTimeout(timerFuncExpiration);

    if (timeToAnswer > 0 && game) {
      timerFuncExpiration = setTimeout(() => {
        handleTimer(game.timer, game.gameStep.split('-')[1]);
      }, 1000);
    } else if (game?.isTimerFix && timeToAnswer <= config.voteTimerTolerance && isNewStep && vote === enumVote['init']) {
      // launch a default vote when out of time
      setVote(enumVote['real']);
    }

    return () => clearTimeout(timerFuncExpiration);
  }, [timeToAnswer]);

  const handleVote = async () => {
    const res = await props.handleVote(vote - 1, hp);
    if (res) {
      setTimeToAnswer(0);
      clearTimeout(timerFuncExpiration);
    }
  }

  const handleTimer = (duration: number, initTime: string) => {
    const newTime = new Date().getTime();
    const stillHave = duration - (newTime - parseInt(initTime));
    setTimeToAnswer(stillHave);
  }

  const handleNext = (game: Game) => {
    const lastVote = game.votes[props.playerName][game.votes[props.playerName].length - 1];
    const isPlayerWin = lastVote.choice == Number(game.cardsAnswer[game.cards.length - 1].isAI);
    const ai = AIHp + (calculatorXp(
      lastVote.stepStart,
      lastVote.stepEnd,
      lastVote.hp,
      true,
    ) * (isPlayerWin ? -1 : 1));
    const p = playerHp + calculatorXp(
      lastVote.stepStart,
      lastVote.stepEnd,
      lastVote.hp,
      isPlayerWin,
    ) * (isPlayerWin ? 1 : -1);
    setAIHp(ai);
    setPlayerHp(p);
    if (p <= 0 || ai <= 0) return props.handleEnd();
    return props.handleNext();
  }

  const calculProgress = (progress: number, duration: number) => {
    let res;
    if (progress < 500) // close to 0, session ending
        res = 0;
    else if (progress > (duration - 1500)) // less than 1.5s, session started
      res = 100;
    else
      res = progress / duration * 100;
    return positifNumberOrZero(res);
  }

  const displayProgress = (progress: number) => {
    const c = Math.round(timeToAnswer / 1000);
    return progress < 500 ? 0 : parseInt(c + '');
  }

  return (
    <>
      <div className={"container full-size " + styles.containerResponsive + ' ' + (vote === enumVote['result'] ? styles.headResult : '')}>

        {game && <div className={styles.headGame}>
          <p className={styles.counter}>{game?.cards.length} / {game?.maxCards}</p>
          <div className={styles.quitButton} onClick={() => props.handleClose()}>Quit the game</div>
          <div className={styles.quitButtonMobile} onClick={() => props.handleClose()}>Quit</div>
        </div>}

        {/* Screen Result step */}
        {game
          && vote === enumVote['result']
          && <div className={`${styles.resultStep} ${styles.resultStep}`}>
            <h2 className={styles.resultTitle}>Result</h2>
            <div>
              <h3 style={{ animation: 'glitch 3s ease-in-out infinite, glitch-scan 6s ease-in-out infinite' }} className={styles.resultSubtitle}>It was {
                game.cardsAnswer[game.cardsAnswer.length - 1].isAI ?
                  'AI-Generated' : 'Real'
              }</h3>
              <p>You
                {game.votes[props.playerName][game.votes[props.playerName].length - 1].choice == Number(game.cardsAnswer[game.cardsAnswer.length - 1].isAI) ? ' win ' : ' lost -'}
                <b>{calculatorXp(
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].stepStart,
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].stepEnd,
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].hp,
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].choice == Number(game.cardsAnswer[game.cardsAnswer.length - 1].isAI)
                )}</b></p>
              <p style={{ marginBottom: 0 }}>Answer in <b>{(game.votes[props.playerName][game.votes[props.playerName].length - 1].stepEnd - game.votes[props.playerName][game.votes[props.playerName].length - 1].stepStart) / 1000}s</b></p>
              <p style={{ marginTop: 0 }}>The faster you bet, the more points you get</p>
            </div>
            <button className={styles.nextButton} onClick={() => !props.loading && handleNext(game)}>
              {props.loading && 'Loading...'}
              {!props.loading && 'Next'}
            </button>
          </div>}

        {/* Screen normal step */}
        {game
          && game?.cards.length <= game?.maxCards
          && vote !== enumVote['result']
          && <div className={styles.fullSize}>

            {props.games[props.party].isTimerFix && <div className={styles.timer}>
              <p className={styles.progress}>
                <Progress 
                  percent={calculProgress(timeToAnswer, props.games[props.party].timer)}
                  showInfo={false}
                  strokeColor="#daa520"
                />
              </p>
              <p className={styles.count}>{displayProgress(timeToAnswer)}</p>
            </div>}
            <div className={styles.tableContainer}>
              {/* display players & actions */}
              <DisplayPlayers
                playersHp={{ player: playerHp, ai: AIHp }}
                playerName={props.playerName}
                players={game.players}
                enumVote={enumVote}
                votes={game.votes}
                vote={vote}
                setVote={setVote}
                hp={hp}
                setHp={setHp}
                hpChoose={{max: config.hpChooseMax, min: config.hpChooseMin} }
                nbCards={game.cards.length}
              />

              <div className={styles.displayCard}>
                {props.loading && <div className={styles.loadingScreen}>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: '50px' }} spin />} />
                </div>}
                <PhotoProvider
                  loadingElement={<p style={{ color: 'white' }}>Loading</p>}
                >
                  {game && (() => {
                    const validIndex = findStrInArray(imageList, game.cards[game.cards.length - 1]);

                    return (
                      <Card
                        autoReturn
                        showFace={false}
                        onClick={() => console.log('nothing-todo')}
                        style={{
                          //maxWidth: '300px',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        imgLoaded={true}
                      >
                        <PhotoView
                          src={imageList[validIndex]}
                        >
                          <img
                            src={imageList[validIndex]}
                            className={styles.cardImage}
                            alt="game card"
                            onError={(e) => {
                              console.error('Image failed to load:', e);
                              console.error('Attempted to load image at index:', validIndex);
                            }}
                          />
                        </PhotoView>
                      </Card>
                    );
                  })()}
                </PhotoProvider>
              </div>
            </div>
          </div>}

      </div >

    </>
  )
}

export default GameBoard
