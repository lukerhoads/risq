import { useEffect, useState } from 'react';
import styles from '../styles/response.module.scss';
import { closeEnough } from '../util';
import { aiSentenceGrade } from '../ai/mock';
import james from '../images/james.gif';
import Image from 'next/image';

type DerivedSentence = {
  sentence: string;
  betAmount: number;
};
type DerivedSentences = {
  [term: string]: DerivedSentence;
};

interface ResponseProps {
  score: number;
  text: boolean;
  possibleAnswers: string[];
  correctAnswer: number | string;
  onAnswer: (
    right: boolean,
    amount: number | undefined,
    response: string | undefined
  ) => void;
  betting: boolean;
  derivedSentences: DerivedSentences;
  isAI: boolean;
  answer: string;
}

export default function Response({
  answer,
  isAI,
  derivedSentences,
  score,
  betting,
  text,
  possibleAnswers,
  onAnswer,
  correctAnswer,
}: ResponseProps) {
  if (!text && !possibleAnswers) return null;
  const [showJames, setShowJames] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [correctIdx, setCorrectIdx] = useState(null);
  const [incorrectIdx, setIncorrectIdx] = useState(null);
  const [correctText, setCorrectText] = useState(false);
  const [incorrectText, setIncorrectText] = useState(false);
  const [error, setError] = useState('');

  // handleKeyPress reacts to the enter key during the typing response.
  const handleKeyPress = e => {
    if (e.key === 'Enter' && text) {
      // Treat betAmount as zero if not filled out.
      let betAmt = betAmount == '' ? 0 : parseInt(betAmount);
      if (betAmt > score) {
        setError('Bet amount higher than balance.');
        return;
      }

      // Grade with AI according to settings.
      let correct = isAI
        ? aiSentenceGrade(answer, textResponse)
        : closeEnough(textResponse, correctAnswer);
      console.log('Correct: ', correct);
      onAnswer(correct, betAmt, textResponse);
      if (correct) {
        setCorrectText(true);
      } else {
        setIncorrectText(true);
      }

      // Show animation of James Holzhauer going all in, like the player
      // just did.
      if (correct && betAmt == score) {
        setShowJames(true);
        setTimeout(() => {
          setShowJames(false);
        }, 1000);
      }
    }
  };

  // onChoiceClicked reacts to a multiple choice selection.
  const onChoiceClicked = idx => {
    if (!text) {
      onAnswer(idx === correctAnswer);
      if (idx === correctAnswer) {
        setCorrectIdx(idx);
      } else {
        setCorrectIdx(correctAnswer);
        setIncorrectIdx(idx);
      }
    }

    setTimeout(() => {
      setCorrectIdx(null);
      setIncorrectIdx(null);
    }, 500);
  };

  // verifyAndSetBet validates that the bet amount is less than the balance.
  const verifyAndSetBet = e => {
    let bet = e.target.value;
    if (Number.isNaN(bet)) {
      setError('Bet invalid number');
      return;
    }

    setBetAmount(bet);
  };

  return (
    <div className={styles.responseContainer}>
      {showJames && <Image alt="james" className={styles.james} src={james} />}
      <div className={styles.response}>
        {text ? (
          <div className={styles.responseInput}>
            <input
              autoFocus
              placeholder="Response"
              value={textResponse}
              onChange={e => setTextResponse(e.target.value)}
              onKeyDown={handleKeyPress}
              className={`${correctText ? styles.greenInput : ''} ${
                incorrectText ? styles.redInput : ''
              }`}
            />
            {betting && (
              <input
                placeholder="Bet amount"
                value={betAmount}
                onChange={verifyAndSetBet}
                onKeyDown={handleKeyPress}
              />
            )}
            {error != '' && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          <div className={styles.responseChoices}>
            {possibleAnswers.map((possibleAnswer, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => onChoiceClicked(idx)}
                  className={`${styles.possibleAnswer} ${
                    correctIdx != null && correctIdx == idx ? styles.green : ''
                  } ${
                    incorrectIdx != null && incorrectIdx == idx
                      ? styles.red
                      : ''
                  }`}
                >
                  {possibleAnswer}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
