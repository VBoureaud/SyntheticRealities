import { Switch } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './gameCreate.module.css';

type Props = {
  onClick: Function;
  desc: string;
  timer: boolean;
  onTimer: Function;
  loading: boolean;
}

function GameCreate(props: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.timerContainer}>
        <span className={styles.timerText}>
          <ClockCircleOutlined /> Timed Mode
        </span>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={props.timer}
          onChange={() => props.onTimer()}
          style={{ marginLeft: '8px' }}
        />
      </div>

      <div
        onClick={() => !props.loading && props.onClick()}
        className={styles.startButton}
        style={{
          animation: 'glitch 3s ease-in-out infinite, glitch-scan 6s ease-in-out infinite'
        }}
      >
        {!props.loading && <>Press to start</>}
        {props.loading && <>Loading...</>}
      </div>
    </div>
  );
}

export default GameCreate;
