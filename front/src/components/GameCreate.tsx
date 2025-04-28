// import { useState, useEffect } from 'react'

import { Switch } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { colors } from '../styles/colors';

type Props = {
  onClick: Function;
  desc: string;
  timer: boolean;
  onTimer: Function;
  loading: boolean;
}

function GameCreate(props: Props) {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      marginTop: '20px'
    }}>
      <div style={{ 
        background: colors.background.dark,
        padding: '12px 16px', 
          boxSizing: 'border-box', 
          borderRadius: '8px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
        border: `1px solid ${colors.ui.border}`,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        width: '200px'
        }}>
        <span style={{ 
          color: colors.text.secondary, 
          fontSize: '0.9rem', 
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
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
          style={{ 
            background: 'transparent',
          color: colors.primary,
            border: 'none',
          padding: '16px 32px',
          fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(218, 165, 32, 0.3)',
            animation: 'glitch 3s ease-in-out infinite, glitch-scan 6s ease-in-out infinite',
            position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
          }}
        >
          {!props.loading && <>Press to start</>}
          {props.loading && <>Loading...</>}
        </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        alignItems: 'center',
        marginTop: '10px'
      }}>
          <div className="glitch-line" style={{
            width: '60%',
            height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            animation: 'glitch-line-1 4s ease-in-out infinite'
          }} />
          <div className="glitch-line" style={{
            width: '45%',
            height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            animation: 'glitch-line-2 3.5s ease-in-out infinite',
            opacity: 0.8
          }} />
          <div className="glitch-line" style={{
            width: '30%',
            height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            animation: 'glitch-line-3 3s ease-in-out infinite',
            opacity: 0.6
          }} />
        </div>
      </div>
  )
}

export default GameCreate
