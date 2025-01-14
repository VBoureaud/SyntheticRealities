import { useState, useEffect } from 'react'
import { Games, Game } from "../store/types";
import { LoadingOutlined, SketchCircleFilled, OpenAIOutlined } from '@ant-design/icons';
import { Spin, Slider, Progress } from 'antd';
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { positifNumberOrZero, calculatorXp } from '../utils';
import config from '../config';
import styles from './gameboard.module.css';

import Card from "./Card";
import imageList from "./imageList";
import IconVersus64 from "../assets/icon_versus_64.png";

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
        const maxHp = playerHp > config.hpChooseMax ? config.hpChooseMax : playerHp;
        setHp(parseInt(maxHp / 2 + ''));
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
          <div style={{ height: 'fit-content' }} onClick={() => props.handleClose()} className="button">Quit the game</div>
        </div>}

        {/* Screen Result step */}
        {game
          && vote === enumVote['result']
          && <div className={styles.resultStep}>
            <h2>Stage Result</h2>
            <div>
              <h3>It was {
                game.cardsAnswer[game.cardsAnswer.length - 1].isAI ?
                  'AI-Generated' : 'Real'
              }</h3>
              <p>You
                {game.votes[props.playerName][game.votes[props.playerName].length - 1].choice == Number(game.cardsAnswer[game.cardsAnswer.length - 1].isAI) ? ' win ' : ' loss -'}
                <b>{calculatorXp(
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].stepStart,
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].stepEnd,
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].hp,
                  game.votes[props.playerName][game.votes[props.playerName].length - 1].choice == Number(game.cardsAnswer[game.cardsAnswer.length - 1].isAI)
                )}</b></p>
              <p style={{ marginBottom: 0 }}>Answer in <b>{(game.votes[props.playerName][game.votes[props.playerName].length - 1].stepEnd - game.votes[props.playerName][game.votes[props.playerName].length - 1].stepStart) / 1000}s</b></p>
              <p style={{ marginTop: 0 }}>The faster you bet, the more points you get</p>
            </div>
            <button style={{ maxWidth: '100px', margin: '40px auto' }} onClick={() => !props.loading && handleNext(game)}>
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
                <Progress percent={timeToAnswer / props.games[props.party].timer * 100} showInfo={false} />
              </p>
              <p className={styles.count}>{positifNumberOrZero(parseInt(timeToAnswer / 1000 + ''))}</p>
            </div>}
            <div className={styles.tableContainer}>
              <div className={styles.displayPlayer}>
                {/* AI Life Box */}
                <div className={styles.aiContainer}>
                  <OpenAIOutlined style={{ fontSize: '28px', marginRight: '15px' }} />
                  <p style={{ display: 'flex' }}>
                    <span style={{ fontSize: '25px' }}>{AIHp}</span>
                    <SketchCircleFilled style={{ fontSize: '28px', marginLeft: '5px' }} />
                  </p>
                </div>

                <img src={IconVersus64} alt="icon-versus-64" />

                {/* Players Block */}
                {game && game.players.map((e: string, index: number) =>
                  <div className={styles.playerZone} key={index}>
                    <div className={styles.playerContainerLife} style={{ maxWidth: '100%' }}>
                      <p><b>{props.playerName}</b></p>
                      <p style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{ fontSize: '25px' }}>{playerHp}</span>
                        <SketchCircleFilled style={{ fontSize: '28px', marginLeft: '5px' }} />
                      </p>
                    </div>
                    <div className={styles.playerContainer}>
                      <p style={{ margin: '10px 0', fontWeight: 'bold', letterSpacing: '1px' }}>Who made this ?</p>

                      <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ flex: 5 }}>
                          <Slider disabled={vote !== enumVote['init']} value={hp} onChange={(v: number) => setHp(v)} max={config.hpChooseMax <= playerHp ? config.hpChooseMax : playerHp} min={config.hpChooseMin < playerHp ? config.hpChooseMin : playerHp} tooltip={{ open: false }} />
                        </span>
                        <div className={styles.betZone}>
                          <span style={{ width: '55px' }}>{hp}</span>
                          <SketchCircleFilled style={{ fontSize: '28px', marginLeft: '5px' }} />
                        </div>
                      </div>
                      {props.playerName === e && <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <button style={{ marginRight: '5px' }} className={(vote === enumVote['real'] ? 'choiceTrue' : 'choiceWait') + ' realBtn'} onClick={() => vote === 0 && setVote(enumVote['real'])}>
                          Real
                        </button>
                        <p style={{ display: 'none', margin: 0, padding: '10px' }}>OR</p>
                        <button style={{ fontSize: '15px' }} className={vote === enumVote['ai-generated'] ? 'choiceFalse' : 'choiceWait'} onClick={() => vote === 0 && setVote(enumVote['ai-generated'])}>
                          AI-Generated
                        </button>
                      </div>}
                      {props.playerName !== e
                        && (game.votes[e]
                          && game.votes[e].length < game.cards.length
                          || !game.votes[e])
                        && <Spin indicator={<LoadingOutlined style={{ color: 'white' }} spin />} />}
                      {props.playerName !== e
                        && game.votes[e]
                        && game.votes[e].length >= game.cards.length
                        && <p>Voted</p>}
                    </div>
                  </div>
                )}

                {game && game.playersOut.map((e: string, index: number) =>
                  <div key={index} className={styles.playerOutContainer}>
                    <h3>{e}</h3>
                    <p>Player is out</p>
                  </div>
                )}

              </div>
              <div className={styles.displayCard}>
                {props.loading && <div className={styles.loadingScreen}>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: '50px', color: 'white' }} spin />} />
                </div>}
                <PhotoProvider
                  loadingElement={<p style={{ color: 'white' }}>Loading</p>}
                >
                  {game && <Card
                    autoReturn
                    showFace={false}
                    onClick={() => console.log('nothing-todo')}
                    style={{
                      maxWidth: '300px',
                      width: '90%',
                      height: '100%',
                    }}
                    imgLoaded
                  >
                    <PhotoView
                      src={imageList[game.cards[game.cards.length - 1] - 1]}
                    >
                      <img
                        src={imageList[game.cards[game.cards.length - 1] - 1]}
                        style={{ zIndex: 11, maxWidth: '100%', margin: 'auto' }}
                      />
                    </PhotoView>
                    {/*<img
                      src={imageList[game.cards[game.cards.length - 1] - 1]}
                      style={{ maxWidth: '100%', margin: 'auto' }}
                    />*/}
                  </Card>}
                </PhotoProvider>
              </div>
            </div>
          </div>}

      </div >

    </>
  )
}

export default GameBoard
