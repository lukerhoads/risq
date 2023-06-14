import React from 'react';
import styles from '../styles/header.module.scss';
import xIcon from '../icons/x.svg';
import settingsIcon from '../icons/cog.svg';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface HeaderProps {
  timerTotal: number;
  timerElapsed: number;
  questionTotal: number;
  questionElapsed: number;
  onSettingsClick: () => void;
  onClose: () => void;
}

export default function Header({
  timerTotal,
  onSettingsClick,
  timerElapsed,
  questionTotal,
  questionElapsed,
  onClose,
}: HeaderProps) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <div>
          <div>Risq</div>
        </div>
        <div>
          <div className={styles.bgCircle}>
            <CircularProgressbar
              value={timerElapsed / timerTotal}
              maxValue={1}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathTransitionDuration: 0.5,
                trailColor: '#f5f6f9',
                pathColor: '#e372ff',
              })}
            />
          </div>
        </div>
        <div className={styles.icons}>
          <button onClick={() => onSettingsClick()}>
            <Image alt="close" src={settingsIcon} />
          </button>
          <button style={{ marginLeft: '5px' }} onClick={() => onClose()}>
            <Image alt="settings" src={xIcon} />
          </button>
        </div>
      </div>
      <div className={styles.questionProgress}>
        <div
          className={styles.questionActiveProgress}
          style={{
            width: `${(questionElapsed / questionTotal) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
