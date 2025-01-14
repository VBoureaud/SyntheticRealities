// import { useState, useEffect } from 'react'

import { Switch } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';

type Props = {
  onClick: Function;
  desc: string;
  timer: boolean;
  onTimer: Function;
  loading: boolean;
}

function GameCreate(props: Props) {
  return (
    <>
      <h3 style={{ color: 'white', marginTop: '5px', marginBottom: '25px' }}>{props.desc}</h3>
      <div style={{ padding: '25px', margin: 'auto', marginBottom: '25px', maxWidth: '750px' }} className="">
        <div className="switchTimer">
          <span style={{ color: 'white' }}><ClockCircleOutlined /> Timer</span>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={props.timer}
            onChange={() => props.onTimer()}
          />
        </div>
        <div
          className="button"
          onClick={() => !props.loading && props.onClick()}
          style={{ maxWidth: 'fit-content', margin: 'auto', padding: '15px 25px', marginBottom: '25px' }}
        >
          {!props.loading && <>Create a new game</>}
          {props.loading && <>Loading...</>}
        </div>
      </div>
    </>
  )
}

export default GameCreate
