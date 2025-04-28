import { useState, useEffect } from 'react'
import { Games, Game } from "../store/types";
import { LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Spin, Progress } from 'antd';
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { positifNumberOrZero, calculatorXp } from '../utils';
import config from '../config';
import styles from './gameboard.module.css';
import { colors } from '../styles/colors';

import Card from "./Card";
import imageList from "./imageList";
import DisplayPlayers from './DisplayPlayers';

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

  return (
    <>
      <div className={"container full-size " + styles.containerResponsive + ' ' + (vote === enumVote['result'] ? styles.headResult : '')}>

        {game && <div className={styles.headGame}>
          <p className={styles.counter}>{game?.cards.length} / {game?.maxCards}</p>
          <div style={{ 
            color: '#808080',
            fontSize: '1rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            border: '1px solid #808080',
            padding: '8px 15px',
            borderRadius: '8px',
            background: 'transparent'
          }} onClick={() => props.handleClose()}>Quit the game</div>
        </div>}

        {/* Screen Result step */}
        {game
          && vote === enumVote['result']
          && <div className={styles.resultStep} style={{ 
            border: '2px solid #daa520',
            borderRadius: '8px',
            padding: '20px',
            margin: '30px 0',
            background: 'transparent'
          }}>
            <h2 style={{ 
              fontWeight: 'bold', 
              color: '#daa520', 
              letterSpacing: '0.1em', 
              fontSize: '2rem',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>Result</h2>
            <div>
              <h3 style={{ 
                fontWeight: 'bold', 
                color: '#daa520', 
                letterSpacing: '0.1em', 
                fontSize: '1.5rem',
                marginBottom: '20px',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(218, 165, 32, 0.3)',
                animation: 'glitch 3s ease-in-out infinite, glitch-scan 6s ease-in-out infinite'
              }}>It was {
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
            <button style={{ 
              maxWidth: '100px', 
              margin: '40px auto',
              color: '#daa520',
              border: '2px solid #daa520',
              background: 'transparent',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }} onClick={() => !props.loading && handleNext(game)}>
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
                  percent={timeToAnswer / props.games[props.party].timer * 100} 
                  showInfo={false}
                  strokeColor="#daa520"
                />
              </p>
              <p className={styles.count}>{positifNumberOrZero(parseInt(timeToAnswer / 1000 + ''))}</p>
            </div>}
            <div className={styles.tableContainer}>
              {/* display players */}
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
                  <Spin indicator={<LoadingOutlined style={{ fontSize: '50px', color: 'white' }} spin />} />
                </div>}
                <PhotoProvider
                  loadingElement={<p style={{ color: 'white' }}>Loading</p>}
                >
                  {game && (() => {
                    // Ensure we have a valid card index (1-10)
                    const lastCardIndex = game.cards[game.cards.length - 1];
                    const validIndex = ((lastCardIndex - 1) % 10) + 1; // This ensures we get a number between 1 and 10
                    console.log('Card index:', lastCardIndex, 'Valid index:', validIndex);
                    
                    return (
                      <Card
                        autoReturn
                        showFace={false}
                        onClick={() => console.log('nothing-todo')}
                        style={{
                          maxWidth: '300px',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        imgLoaded={true}
                      >
                        <PhotoView
                          src={imageList[validIndex - 1]}
                        >
                          <img
                            src={imageList[validIndex - 1]}
                            style={{ 
                              zIndex: 11, 
                              maxWidth: '100%', 
                              maxHeight: '100%',
                              margin: 'auto',
                              display: 'block',
                              objectFit: 'contain'
                            }}
                            alt="game card"
                            onError={(e) => {
                              console.error('Image failed to load:', e);
                              console.error('Attempted to load image at index:', validIndex - 1);
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
