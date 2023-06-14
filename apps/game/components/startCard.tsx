import styles from '../styles/startCard.module.scss';

interface StartCardProps {
  onStart: () => void;
  previousScore: number | undefined;
  onSettingsClick: () => void;
}

export default function StartCard({
  onStart,
  previousScore,
  onSettingsClick,
}: StartCardProps) {
  return (
    <div className={styles.startCardContainer}>
      <div className={styles.startCard}>
        <h1>Risq</h1>
        <button onClick={() => onStart()}>Play</button>
        <p className={styles.settingsText} onClick={onSettingsClick}>
          Settings
        </p>
        {previousScore != undefined && <p>Previous score: {previousScore}</p>}
      </div>
    </div>
  );
}
