import { Games } from "../store/types";

import styles from './initgame.module.css';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


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
            <div className={styles.containerInitGame}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Party's name: <span style={{ fontWeight: 'normal' }}>{props.party}</span></p>
                    <p>Players: <span className={styles.playerCount}>{props.games[props.party].players.length}/{props.games[props.party].totalPlayers}</span></p>
                </div>
                <div className={styles.containerPlayer}>
                    {props.games[props.party]
                        && props.games[props.party].players.map((e: string, index: number) =>
                            <div className={styles.player}
                                key={index}>
                                {e}
                            </div>)}
                    {!isTotal && <div style={{ background: '#607a60', display: 'flex', justifyContent: 'center' }} className={styles.containerPlayer}>
                        <Spin indicator={<LoadingOutlined style={{ color: 'white' }} spin />} />
                        <p style={{ fontWeight: 'normal', marginLeft: '10px', marginTop: 0, marginBottom: 0 }}>Waiting for more players...</p>
                    </div>}
                    {isTotal
                        && <div
                            onClick={!props.loading ? () => handleLaunch() : () => { }}
                            className={styles.launchBtn}>{props.loading ? 'Loading...' : 'Launch the game'}</div>}
                    <h3 style={{ fontWeight: 'normal', color: 'white', marginTop: '25px', marginBottom: '0' }}>{props.desc}</h3>
                </div>
            </div>
        </>
    )
}

export default InitGame
