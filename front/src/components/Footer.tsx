import { DashboardOutlined, InfoCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import styles from './footer.module.css';
import { Modal } from 'antd';
import { useState } from 'react';

type Props = {
  gameCount: number;
  link: string;
  style: any;
  isInGame?: boolean;
  handleNotif?: Function;
  linkToPlay: Function;
  LinkToScore: Function;
  linkToHome: Function;
}

function Footer(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLink = (redirection: Function) => {
    if (props.isInGame && props.handleNotif)
      return props.handleNotif('Action not possible during game');
    redirection();
  }

  const showModal = () => {
    if (props.isInGame && props.handleNotif)
      return props.handleNotif('Action not possible during game');
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <footer className={`${styles.footer}`} style={props.style}>
        <div className={styles.footerContainer}>
          <div 
            onClick={showModal}
            className={`${styles.footerButton}`}
          >
            <InfoCircleOutlined style={{ fontSize: '0.9rem' }} />
            <span>How to play</span>
          </div>
          <div 
            onClick={() => handleLink(props.linkToPlay)} 
            className={`${styles.footerButton}`}
          >
            <DashboardOutlined style={{ fontSize: '0.9rem' }} />
            <span>More Info</span>
          </div>
          <div 
            onClick={() => handleLink(props.LinkToScore)} 
            className={`${styles.footerButton}`}
          >
            <TrophyOutlined style={{ fontSize: '0.9rem' }} />
            <span>Leaderboard</span>
          </div>
        </div>
      </footer>

      {/* Modal for game instructions */}
      <Modal
        title="How to Play"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Click "Start" to launch a game with or without a timer. If a timer is set, you have 10 seconds to find the answer; otherwise, it will auto-vote. Try to win points by answering quickly!</p>
      </Modal>
    </>
  )
}

export default Footer
