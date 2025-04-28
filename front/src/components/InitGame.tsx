import { Games } from "../store/types";
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { colors } from '../styles/colors';

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
            <div style={{ 
                color: '#daa520',
                padding: '25px',
                margin: 'auto',
                marginBottom: '25px',
                maxWidth: '750px',
                background: '#2f3437',
                borderRadius: '10px',
                border: '1px solid #daa520',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                }}>
                    <p style={{ 
                        color: '#b0b0b0',
                        fontSize: '1.1rem'
                    }}>Party's name: <span style={{ color: '#b0b0b0', fontWeight: 'bold' }}>{props.party}</span></p>
                    <p style={{ 
                        color: '#b0b0b0',
                        fontSize: '1.1rem'
                    }}>Players: <span style={{ color: '#b0b0b0', fontWeight: 'bold' }}>{props.games[props.party].players.length}/{props.games[props.party].totalPlayers}</span></p>
                </div>
                <div style={{ 
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '20px'
                }}>
                    {props.games[props.party]
                        && props.games[props.party].players.map((e: string, index: number) =>
                            <div key={index} style={{ 
                                padding: '15px',
                                background: '#2f3437',
                                color: '#daa520',
                                fontWeight: 'bold',
                                fontSize: '2rem',
                                textAlign: 'center'
                            }} className="header">
                                <span style={{
                                    animation: 'glitch 3s ease-in-out infinite, glitch-scan 6s ease-in-out infinite',
                                    position: 'relative',
                                    display: 'inline-block'
                                }}>
                                    Hello {e}
                                </span>
                            </div>)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', margin: '20px 0' }}>
                        <div className="glitch-line" style={{
                            width: '60%',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #daa520, transparent)',
                            animation: 'glitch-line-1 4s ease-in-out infinite'
                        }} />
                        <div className="glitch-line" style={{
                            width: '45%',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #daa520, transparent)',
                            animation: 'glitch-line-2 3.5s ease-in-out infinite',
                            opacity: 0.8
                        }} />
                        <div className="glitch-line" style={{
                            width: '30%',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #daa520, transparent)',
                            animation: 'glitch-line-3 3s ease-in-out infinite',
                            opacity: 0.6
                        }} />
                    </div>
                    {!isTotal && <div style={{ 
                        background: '#2f3437', 
                        display: 'flex', 
                        justifyContent: 'center',
                        padding: '15px'
                    }}>
                        <Spin indicator={<LoadingOutlined style={{ color: '#daa520' }} spin />} />
                        <p style={{ 
                            fontWeight: 'normal', 
                            marginLeft: '10px', 
                            marginTop: 0, 
                            marginBottom: 0,
                            color: '#daa520'
                        }}>Waiting for more players...</p>
                    </div>}
                </div>
                <div style={{ 
                    marginTop: '20px',
                    paddingTop: '20px'
                }}>
                    <h2 className="header" style={{
                        color: '#b0b0b0',
                        fontSize: '1.5rem',
                        letterSpacing: '0.05em',
                        marginBottom: '1.5rem',
                        marginTop: '-0.5rem',
                        textTransform: 'none',
                        fontWeight: 'normal',
                        textShadow: 'none',
                        textAlign: 'center',
                        animation: 'glitch 3s ease-in-out infinite, glitch-scan 6s ease-in-out infinite',
                        position: 'relative'
                    }}>Can you distinguish truth from synthetic deception?</h2>
                    <button 
                        onClick={handleLaunch}
                        style={{
                            background: 'transparent',
                            color: '#daa520',
                            border: '1px solid #daa520',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            width: '100%',
                            maxWidth: '300px',
                            margin: '0 auto',
                            display: 'block'
                        }}
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
