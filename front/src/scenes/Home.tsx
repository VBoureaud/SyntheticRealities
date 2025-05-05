import { useState, useEffect, useContext } from 'react'
import GameCreate from "../components/GameCreate";
import GameBoard from "../components/GameBoard";
import GameEndScreen from "../components/GameEndScreen";
//import ListGame from "../components/ListGame";
import InitGame from "../components/InitGame";
import Footer from "../components/Footer";
import GameContext, { steps, eSteps } from "../store";
import { message, Modal, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Web2Context from "../store/web2store";
import config from "../config";
import { colors } from '../styles/colors';

function Home() {
  const store = useContext(GameContext);
  const storeWeb2 = useContext(Web2Context);
  const [tmpName, setTmpName] = useState('');
  const [tmpTimerFix, setTmpTimerFix] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const msgError = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  useEffect(() => {
    if (storeWeb2 && storeWeb2.error)
      msgError(storeWeb2.error);
  }, [storeWeb2 && storeWeb2.error])

  useEffect(() => {
    store.initStore();
  }, []);

  useEffect(() => {
    if (store.playerName && !tmpName) setTmpName(store.playerName);
  }, [store.playerName])

  const handleLoader = () => {
    if (storeWeb2)
      return storeWeb2.loadingCreate
        || storeWeb2.loadingUpdate
        || storeWeb2.loadingCard
        || storeWeb2.loadingDetail
        || storeWeb2.loadingScore
        || store.loadingGame;
    return store.loadingGame;
  }

  const handleQuit = () => {
    //if (store.party === store.playerName)
    store.handlePublish(store.askQuitGame(store.games, store.playerName, store.party));
  }

  const handleChangename = (name: string) => {
    if (name.indexOf('#') != -1)
      return msgError("You can't use this character '#'.");
    else if (name.length >= 10)
      return msgError("The name cannot exceed 10 characters in length.");
    store.saveName(name);
    return setIsModalOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title="Change your name" open={isModalOpen} onOk={() => handleChangename(tmpName ? tmpName : store.playerName)} onCancel={() => setIsModalOpen(false)}>
        <Input value={tmpName} onChange={(e) => setTmpName(e.target.value)} />
      </Modal>

      <div style={{ maxWidth: '1145px', margin: 'auto' }}>
        <div className="inner-shadow">
          {!store.party && <div className="header">
            <h1 style={{ 
              fontWeight: 'bold', 
              color: colors.mustardYellow, 
              letterSpacing: '0.1em', 
              fontSize: '3.5rem',
              marginBottom: '3rem'
            }}>Synthetic Realities</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginBottom: '2rem' }}>
              <div className="glitch-line glitch-line-1" />
              <div className="glitch-line glitch-line-2" />
              <div className="glitch-line glitch-line-3" />
            </div>
            {
              store.playerName && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ 
                  marginTop: '10px', 
                  marginBottom: '10px',
                  color: '#d0d0d0',
                  fontSize: '1.25rem'
                }}>Hello <strong style={{ color: '#daa520' }}>{store.playerName}</strong></p>
                <EditOutlined onClick={() => setIsModalOpen(true)} style={{ 
                  color: colors.blushPink, 
                  marginLeft: '10px', 
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }} />
              </div>
            }
          </div>}

          {/* End Screen */}
          {
            store.party
            && store.games
            && store.games[store.party]
            && store.games[store.party].gameStep === steps[eSteps['end']]
            && <GameEndScreen
              playerName={store.playerName}
              games={store.games}
              party={store.party}
              handleClose={() => handleQuit()}
              handleWin={() => storeWeb2?.getScore()}
            />
          }

          {/* During Game */}
          {
            store.party
            && store.games
            && store.games[store.party]
            && store.games[store.party].gameStep.split('-').length > 1
            && <GameBoard
              loading={handleLoader()}
              playerName={store.playerName}
              games={store.games}
              party={store.party}
              maxHp={store.games[store.party].defaultPlayersHP}// todo - with calculation
              handleVote={(vote: number, hp: number) => store.handlePublish(store.askVoteGame(store.games, store.playerName, store.party, vote, hp))}
              handleNext={() => store.handlePublish(store.askNextGame(store.games, store.playerName, store.party))}
              handleClose={() => handleQuit()}
              handleEnd={() => store.handlePublish(store.askEndGame(store.games, store.playerName, store.party))}
            />
          }
          {/* List Games & Join */}
          {/*
          store.playerName
          && Object.keys(store.games).length
          && !store.party
          && <ListGame
            desc={"List of joinable games"}
            onClick={(name: string) => store.handlePublish(store.joinGame(store.games, store.playerName, name))}
            games={store.games}
          />
        */}
          {/* Create a new Game */}
          {
            store.playerName
            && !store.party
            && <GameCreate
              desc={""}
              loading={handleLoader()}
              timer={tmpTimerFix}
              onTimer={() => setTmpTimerFix(!tmpTimerFix)}
              onClick={async () => store.handlePublish(await
                store.askCreateGame(
                  store.games,
                  store.playerName,
                  config.totalPlayers,
                  config.playersHP,
                  config.AiHP,
                  config.timer,
                  tmpTimerFix,
                  config.maxCards
                ))
              }
            />
          }
          {/* Game Init step */}
          {
            store.playerName
            && store.party
            && store.games[store.party]
            && store.games[store.party].gameStep == steps[eSteps['create']]
            && <InitGame
              loading={handleLoader()}
              desc={"For each round you can bet and vote for your answer."}
              // onClick={(name: string) => store.handlePublish(store.joinGame(store.games, store.playerName, name))}
              games={store.games}
              party={store.party}
              player={store.playerName}
              onLaunch={() => store.handlePublish(store.askLaunchGame(store.games, store.playerName, store.party))}
            />
          }
        </div>
        <div style={{ marginTop: '11px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', margin: '10px 0' }}>
            <div className="glitch-line glitch-line-1" />
            <div className="glitch-line glitch-line-2" />
            <div className="glitch-line glitch-line-3" />
          </div>
          <Footer
            style={{ maxWidth: '940px', margin: 'auto', marginTop: '0' }}
            gameCount={0}
            isInGame={!!store.games[store.party]}
            handleNotif={(msg: string) => msgError(msg)}
            linkToHome={() => navigate("/")}
            linkToPlay={() => navigate("/about")}
            LinkToScore={() => navigate("/score")}
            link={'https://gitlab.com/'}
          />
        </div>
      </div>
    </>
  )
}

export default Home
