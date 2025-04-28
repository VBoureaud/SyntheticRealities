import { DashboardOutlined, InfoCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { colors } from '../styles/colors';

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
      <footer style={{
        ...props.style,
        marginTop: '-20px',
        padding: '8px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          alignItems: 'center'
        }}>
          <div 
            className="btn_footer"
            style={{
              background: 'transparent',
              color: colors.text.secondary,
              border: 'none',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <InfoCircleOutlined style={{ fontSize: '0.9rem' }} />
            <span>How to play</span>
          </div>
          <div 
            onClick={() => handleLink(props.linkToPlay)} 
            className="btn_footer"
            style={{
              background: 'transparent',
              color: colors.text.secondary,
              border: 'none',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <DashboardOutlined style={{ fontSize: '0.9rem' }} />
            <span>More Info</span>
          </div>
          <div 
            onClick={() => handleLink(props.LinkToScore)} 
            className="btn_footer"
            style={{
              background: 'transparent',
              color: colors.text.secondary,
              border: 'none',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
            }}
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
