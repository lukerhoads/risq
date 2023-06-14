import Quizlet from 'dataset';
import styles from '../styles/startCard.module.scss';
import ToggleSwitch from './toggleSwitch';

interface StartCardProps {
  onStart: () => void;
  onSettingsClick: () => void;
  quizletSet: number;
  setQuizletSet: (set) => void;
}

const QUIZLET_SETS = Quizlet.getAllSets();

export default function StartCard({
  onStart,
  onSettingsClick,
  quizletSet,
  setQuizletSet,
}: StartCardProps) {
  const handleChange = e => {
    setQuizletSet(e.target.value);
  };

  return (
    <div className={styles.startCardContainer}>
      <div className={styles.startCard}>
        <h1>Risq</h1>
        <select onChange={handleChange} value={quizletSet}>
          {QUIZLET_SETS.map((set, idx) => {
            return (
              <option key={idx} value={idx}>
                {set.set.title}
              </option>
            );
          })}
        </select>
        <button onClick={() => onStart()}>Play</button>
        <p className={styles.settingsText} onClick={onSettingsClick}>
          Settings
        </p>
      </div>
    </div>
  );
}
