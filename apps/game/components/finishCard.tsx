import Quizlet from 'dataset';
import styles from '../styles/finishCard.module.scss';
import QuizletCharacter from '../images/Quizlet Celebration.png'
import Image from 'next/image'

interface FinishCardProps {
  previousScore: number;
  onReturn: () => void;
}

export default function FinishCard({
  previousScore,
  onReturn,
}: FinishCardProps) {
  return (
    <div className={styles.finishCardContainer}>
      <div className={styles.finishCard}>
        <h1>Congratulations!</h1>
        <div className={styles.celebrationWrapper}>
            <Image alt="character" src={QuizletCharacter} />
            <div className={styles.scoreWrapper}>
                <p>Previous score</p>
                <h1>{previousScore}</h1>
            </div>
            <Image alt="character" src={QuizletCharacter} className={styles.second} />
        </div>
        
        <p onClick={() => onReturn()} className={styles.returnText}>Return to start</p>
      </div>
    </div>
  );
}
