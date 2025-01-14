import { Games } from "../store/types";

type Props = {
    onClick: Function;
    desc: string;
    games: Games;
}

function ListGame(props: Props) {
    return (
        <>
            <h3 style={{ color: 'white', marginTop: '25px' }}>{props.desc}</h3>
            <div>
                {Object.keys(props.games).map((e: string, index: number) =>
                    <div style={{ cursor: 'pointer', background: 'white', color: 'black', padding: '20px' }} key={index} onClick={() => props.onClick(e)}>
                        Game by <span style={{ fontWeight: 'bold', fontSize: '17px' }}>{e}</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default ListGame
