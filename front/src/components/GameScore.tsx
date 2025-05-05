import { Table, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { ScoreType } from '../store/types';
import { displayDate } from '../utils';

interface Props {
    data: ScoreType[];
}

const columns: TableColumnsType<ScoreType> = [
    {
        title: 'Pos',
        dataIndex: 'key',
        render: (text) => <div className="tabPosKeyTable">{text + 1}</div>,
    },
    {
        title: 'PlayerName',
        dataIndex: 'playerName',
        render: (text: string, record: ScoreType) => <div>
            <Tooltip title={"Game #" + text.split('#')[1] + " - " + displayDate('', true, new Date(record.date + ''))}>
                <span>{text.split('#')[0]}</span>
            </Tooltip>
        </div>,
    },
    {
        title: 'Score',
        dataIndex: 'score',
        render: (text) => <div className="scoreBoxTable">{text}</div>,
        sorter: (a, b) => a.score - b.score,
    },
    {
        title: 'Time',
        dataIndex: 'time',
        render: (text) => <div>{text / 1000}s</div>,
        sorter: (a, b) => a.time - b.time,
    },
    /*{
        title: 'Date',
        dataIndex: 'date',
        responsive: ['xxl', 'xl', 'lg', 'md'],
        render: (text) => <>{displayDate('', true, new Date(text + ''))}</>,
        sorter: (a, b) => parseInt(a.date + '') - parseInt(b.date + ''),
    },*/
];

function GameScore(props: Props) {
    return (
        <>
            <Table<ScoreType>
                className="rowScoreTable"
                columns={columns}
                dataSource={props.data}
                showSorterTooltip={{ target: 'sorter-icon' }}
                pagination={{ pageSize: 20 }}
            />
        </>
    );
}

export default GameScore;