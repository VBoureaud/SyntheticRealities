import { DashboardOutlined, InfoCircleOutlined } from '@ant-design/icons';

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
      <footer style={props.style} className="footer">
        <div>
          <h4 onClick={() => handleLink(props.linkToHome)}>Who Made This?</h4>
          <h6>Description game</h6>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <div className="btn_footer"><span className="questionFooter">How to play </span>?</div>
          <div onClick={() => handleLink(props.linkToPlay)} className="btn_footer">
            <InfoCircleOutlined style={{ borderRadius: '10px', background: '#8a5cf5' }} /></div>
          <div onClick={() => handleLink(props.LinkToScore)} className="btn_footer">
            <DashboardOutlined style={{ borderRadius: '10px', background: '#dd2c2c' }} /></div>
        </div>
      </footer>
    </>
  )
}

export default Footer
