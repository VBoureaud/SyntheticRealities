import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './card.module.css';

type Props = {
  showFace: boolean;
  imgLoaded: boolean;
  autoReturn: boolean;
  onClick: Function;
  children: any;
  style: any;
}

const Card: React.FC<Props> = (props) => {
  const [showFace, setShowFace] = useState<boolean>(props.showFace !== undefined ? props.showFace : false);
  const [firstShow, setFirstShow] = useState<boolean>(true);
  const [imgLoaded, setImgLoaded] = useState<boolean>(props.imgLoaded);
  const [opacityVisible/*, setOpacityVisible*/] = useState<boolean>(true);

  useEffect(() => {
    if (props.autoReturn) {
      setTimeout(() => {
        setShowFace(!showFace);
        setFirstShow(false);
      }, 750);
    }
  }, []);

  useEffect(() => {
    if (props.imgLoaded !== imgLoaded) {
      setImgLoaded(props.imgLoaded);
    }
  }, [props.imgLoaded]);

  // const toggleVisible = () => {
  //   setShowFace(!showFace);
  //   setFirstShow(false);
  // };

  // const toggleOpacity = () => {
  //   setOpacityVisible(!opacityVisible);
  // };

  // const getFaceVisibile = () => {
  //   return showFace;
  // };

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      setShowFace(!showFace);
    }
  };

  return (
    <div
      className={styles.card_scene + ' ' + (opacityVisible ? '' : styles.card_invisible)}
      style={props.style}
      onClick={handleClick}>
      <div className={
        styles.card + ' '
        + (showFace ? styles.card_flipped : !firstShow ? styles.card_unflip : '')}>
        <div className={styles.card_face + ' ' + styles.card_backing}>
          <div className={styles.grain_overlay}></div>
          <div className={styles.top_banner}></div>
          <div className={styles.back_main}></div>
        </div>
        <div className={styles.card_face + ' ' + styles.card_front}>
          <div className={styles.main_panel}>
            {!imgLoaded &&
              <div className={styles.cardLoading}>
                Loading
              </div>}
            {props.children}
          </div>
          <div className={styles.grain_overlay}></div>
        </div>
      </div>
    </div>
  );
};

export default Card;