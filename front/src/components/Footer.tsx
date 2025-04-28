import { DashboardOutlined, InfoCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { colors } from '../styles/colors';
import styles from './footer.module.css';

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
  const handleLink = (redirection: Function) => {
    if (props.isInGame && props.handleNotif)
      return props.handleNotif('Action not possible during game');
    redirection();
  }
  return (
    <>
      <footer className={`${styles.footer}`} style={props.style}>
        <div className={styles.footerContainer}>
          <div 
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
    </>
  )
}

export default Footer
