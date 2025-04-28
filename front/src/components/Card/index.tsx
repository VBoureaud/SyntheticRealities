import * as React from 'react';

import styles from './card.module.css';

type Props = {
  showFace: boolean;
  imgLoaded: boolean;
  autoReturn: boolean;
  onClick: Function;
  children: any;
  style: any;
}

type State = {
  showFace: boolean;
  firstShow: boolean;
  imgLoaded: boolean;
  opacityVisible: boolean;
}

class Card extends React.PureComponent<Props, State>{
  constructor(props: Props) {
    super(props);

    const state: State = {
      showFace: props.showFace != undefined ? props.showFace : false,
      firstShow: true,
      imgLoaded: props.imgLoaded,
      opacityVisible: true,
    };

    this.state = state;

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.props.autoReturn) {
      setTimeout(() => {
        this.setState({
          showFace: !this.state.showFace,
          firstShow: false,
        });
      }, 750);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.imgLoaded !== this.props.imgLoaded) {
      this.setState({ imgLoaded: this.props.imgLoaded });
    }
  }

  toggleVisible() {
    this.setState({
      showFace: !this.state.showFace,
      firstShow: false,
    })
  }

  toggleOpacity() {
    this.setState({
      opacityVisible: !this.state.opacityVisible,
    });
  }

  getFaceVisibile() {
    return this.state.showFace;
  }

  handleClick() {
    if (this.props.onClick)
      this.props.onClick();
    else {
      this.setState({ showFace: !this.state.showFace });
    }
  }

  render() {
    return (
      <div
        className={styles.card_scene + ' ' + (this.state.opacityVisible ? '' : styles.card_invisible)}
        style={this.props.style}
        onClick={this.handleClick}>
        <div className={
          styles.card + ' '
          + (this.state.showFace ? styles.card_flipped : !this.state.firstShow ? styles.card_unflip : '')}>
          <div className={styles.card_face + ' ' + styles.card_backing}>
            <div className={styles.grain_overlay}></div>
            <div className={styles.top_banner}></div>
            <div className={styles.back_main}></div>
          </div>
          <div className={styles.card_face + ' ' + styles.card_front}>
            <div className={styles.main_panel}>
              {!this.state.imgLoaded &&
                <div className={styles.cardLoading}>
                  Loading
                </div>}
              {this.props.children}
            </div>
            <div className={styles.grain_overlay}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;