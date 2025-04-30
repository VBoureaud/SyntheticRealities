import React from 'react';
import styles from './displayPlayers.module.css';
import { LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Spin, Slider } from 'antd';

interface DisplayPlayersProps {
    playersHp: { ai: number, player: number },
    playerName: string,
    players: any,
    enumVote: {[key: string]: number},
    votes: any,
    vote: number,
    setVote: Function,
    hp: number,
    setHp: Function,
    hpChoose: {max: number, min: number }, // config.hpChooseMax
    nbCards: number, //game.cards.length
}

const DisplayPlayers: React.FC<DisplayPlayersProps> = (props) => {

  return (
    <div className={styles.displayPlayer}>
      {/* VS Container */}
      <div className={styles.vsContainer}>
        {/* AI Section */}
        <div className={styles.vsSection}>
          <h2 className={styles.vsTitle}>AI</h2>
          <p className={styles.vsValue}>
            <span className={styles.vsValueText}>{props.playersHp.ai}</span>
            <ThunderboltOutlined className={styles.vsIcon} />
          </p>
        </div>

        {/* VS Section */}
        <div className={styles.vsDivider}>
          <h1 className={styles.vsDividerTitle}>VS</h1>
        </div>

        {/* Player Section */}
        <div className={styles.vsSection}>
          <h2 className={styles.vsTitle}>{props.playerName}</h2>
          <p className={styles.vsValue}>
            <span className={styles.vsValueText}>{props.playersHp.player}</span>
            <ThunderboltOutlined className={styles.vsIcon} />
          </p>
        </div>
      </div>

      {/* Decorative Separation */}
      <div className={styles.decorativeSeparator}>
        <div className={styles.separatorLine}>
          {/* <div className={styles.separatorCircle} /> */}
        </div>
      </div>

      {/* Players Block */}
      {props.players && props.players.map((e: string, index: number) =>
        <div className={styles.playerZone} key={index}>
          <div className={styles.playerContainer}>
            <p className={styles.choiceTitle}>Make Your Choice!</p>

            <div className={styles.sliderContainer}>
              <span className={styles.sliderWrapper}>
                <Slider 
                  disabled={props.vote !== props.enumVote['init'] || props.playersHp.player <= props.hpChoose.min} 
                  value={props.playersHp.player <= props.hpChoose.min ? props.playersHp.player : props.hp}
                  onChange={(v: number) => props.setHp(v)} 
                  max={Math.min(props.hpChoose.max, props.playersHp.player)} 
                  min={props.playersHp.player <= props.hpChoose.min ? props.playersHp.player : props.hpChoose.min}
                  tooltip={{ open: false }}
                  styles={{
                    track: {
                      background: '#daa520',
                      boxShadow: '0 0 10px rgba(218, 165, 32, 0.3)'
                    },
                    handle: {
                      borderColor: '#daa520',
                      boxShadow: '0 0 10px rgba(218, 165, 32, 0.3)'
                    },
                    rail: {
                      background: 'rgba(218, 165, 32, 0.2)'
                    }
                  }}
                />
              </span>
              <div className={styles.betZone}>
                <span className={styles.betValue}>{props.playersHp.player <= props.hpChoose.min ? props.playersHp.player : props.hp}</span>
                <ThunderboltOutlined className={styles.betIcon} />
              </div>
            </div>

            {props.playerName === e && 
              <div className={styles.choiceButtons}>
                <div 
                  className={styles.choiceButton}
                  onClick={() => props.vote === 0 && props.setVote(props.enumVote['real'])}
                >
                  Real
                </div>
                <div 
                  className={styles.choiceButton}
                  onClick={() => props.vote === 0 && props.setVote(props.enumVote['ai-generated'])}
                >
                  AI-Generated
                </div>
              </div>
            }
            {props.playerName !== e
              && (props.votes[e]
                && props.votes[e].length < props.nbCards
                || !props.votes[e])
              && <Spin indicator={<LoadingOutlined className={styles.loadingIcon} spin />} />}
            {props.playerName !== e
              && props.votes[e]
              && props.votes[e].length >= props.nbCards
              && <p className={styles.votedText}>Voted</p>}
          </div>
        </div>
      )}

      {/*game && game.playersOut.map((e: string, index: number) =>
          <div key={index} className={styles.playerOutContainer}>
          <h3>{e}</h3>
          <p>Player is out</p>
          </div>
      )*/}

    </div>
  );
};

export default DisplayPlayers;