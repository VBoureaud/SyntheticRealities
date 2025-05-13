import { Games } from "../store/types";
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './initgame.module.css';

type Props = {
    loading: boolean;
    desc: string;
    games: Games;
    party: string;
    player: string;
    onLaunch: Function;
}

function InitGame(props: Props) {
    const isTotal = props.games[props.party].totalPlayers === props.games[props.party].players.length;
    const [messageApi, contextHolder] = message.useMessage();

    const error = (msg: string) => {
        messageApi.open({
            type: 'error',
            content: msg,
        });
    };

    const handleLaunch = () => {
        if (props.games[props.party].players[0] != props.player)
            error('Only the admin of the game can launch the party, please wait.');
        else {
            console.log('ready to launch');
            props.onLaunch();
        }
    }

    return (
        <>
            {contextHolder}
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <p className={styles.headerText}>Party's name: <span className={styles.headerTextBold}>{props.party}</span></p>
                    <p className={styles.headerText}>Players: <span className={styles.headerTextBold}>{props.games[props.party].players.length}/{props.games[props.party].totalPlayers}</span></p>
                </div>
                <div className={styles.playersContainer}>
                    {props.games[props.party]
                        && props.games[props.party].players.map((e: string, index: number) =>
                            <div key={index} className={`${styles.playerCard} header`}>
                                <span style={{ animation: 'glitch 3s ease-in-out infinite' }} className={styles.playerName}>
                                    Hello {e}
                                </span>
                            </div>)}
                    <div className={styles.glitchContainer}>
                        <div className={`glitch-line ${styles.glitchLine1}`} />
                        <div className={`glitch-line ${styles.glitchLine2}`} />
                        <div className={`glitch-line ${styles.glitchLine3}`} />
                    </div>
                    {!isTotal && <div className={styles.waitingContainer}>
                        <Spin indicator={<LoadingOutlined className={styles.spinIcon} spin />} />
                        <p className={styles.waitingText}>Waiting for more players...</p>
                    </div>}
                </div>
                <div className={styles.contentContainer}>
                    <h2 style={{ animation: 'glitch 3s ease-in-out infinite' }} className={`header ${styles.tagline}`}>Can you distinguish truth from synthetic deception?</h2>
                    <button 
                        onClick={handleLaunch}
                        className={styles.launchButton}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.3)';
                            e.currentTarget.style.background = 'rgba(218, 165, 32, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        {props.loading ? 'Loading...' : 'Launch the game'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default InitGame;
