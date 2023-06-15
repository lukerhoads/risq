import Quizlet from 'dataset';
import Header from '../components/header';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useEffect, useRef, useState } from 'react';
import StartCard from '../components/startCard';
import TermInfo from '../components/termInfo';
import Response from '../components/response';
import { aiOptions, aiReverseOptions } from '../ai/mock';
import {
  extractCard,
  genPossibleAnswers,
  getDefinitions,
  getRandomFromArr,
  getResponses,
  removeFromArr,
  shuffleArray,
} from '../util';
import { defaultSettings } from '../types/settings';
import Settings from '../components/settings';
import FinishCard from '../components/finishCard';

// Proper usage of test cases - still want to test at least a bit of DOM

// TODO:
// - Answer with term or definition - still need to implement here

const QUIZLET_SETS = Quizlet.getAllSets();

export default function Game() {
  let timer = null;

  const [showFinishCard, setShowFinishCard] = useState(false)
  const [quizletSetIdx, setQuizletSetIdx] = useState(0);
  const [quizletSet, setQuizletSet] = useState(QUIZLET_SETS[quizletSetIdx]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [allResponses, setAllResponses] = useState([]);
  const [allDefinitions, setAllDefinitions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const [questionElapsed, setQuestionElapsed] = useState(0);
  const [questionTotal, setQuestionTotal] = useState(0);
  const [originalSelectedItems, setOriginalSelectedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [incorrectlyAnsweredQuestions, setIncorrectlyAnsweredQuestions] =
    useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState(0);
  const [text, setText] = useState(false);
  const [betting, setBetting] = useState(false);
  const [possibleAnswers, setPossibleAnswers] = useState([]);
  const [previousScore, setPreviousScore] = useState(null);
  const [derivedSentences, setDerivedSentences] = useState({});
  const [transitioning, setTransitioning] = useState(false)

  const nodeRef = useRef(null);

  const onSetQuizletSet = set => {
    setQuizletSetIdx(set);
    setQuizletSet(QUIZLET_SETS[set]);
  };

  // updateCount updates the question timer.
  const updateCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        setTimerElapsed(timerElapsed + 1);
      }, 1000);

    if (timerElapsed === timerTotal) {
      onAnswer(false);
      clearInterval(timer);
    }
  };

  // onStart sets up the game for a new player.
  const onStart = () => {
    let selectedTerms = [];
    let maxAmount = settings.batchSize;
    if (quizletSet.studiableItem.length < settings.batchSize) {
      maxAmount = quizletSet.studiableItem.length;
    }
    while (selectedTerms.length < maxAmount) {
      let randomItem = getRandomFromArr(quizletSet.studiableItem);
      if (!selectedTerms.includes(randomItem)) {
        selectedTerms.push(randomItem);
      }
    }
    setDerivedSentences({});
    setTimerElapsed(0);
    setPreviousScore(0);
    setGameStarted(true);
    setSelectedItems(selectedTerms);
    setOriginalSelectedItems(selectedTerms);
    setTimerTotal(settings.questionDuration);
    setQuestionTotal(maxAmount);
    setActiveItem(getRandomFromArr(selectedTerms));
  };

  // genNewItem selects a next item based on whether the user was right,
  // the newSelectedItemsLength, and the new incorrectlyAnsweredQuestions
  // length.
  const genNewItem = (right: boolean, nSIL, nIAQL) => {
    if (settings.aiSentencePhase && gamePhase == 2) {
      let derivedKeys = Object.keys(derivedSentences);
      if (derivedKeys.length > 0) {
        return derivedSentences[getRandomFromArr(derivedKeys)].item;
      }

      return null;
    }

    // selectNew is a convenient method that aids in the selection of a new
    // activeItem.
    const selectNew = (from: any[], exclude?: any[]) => {
      if (from.length == 1) {
        if (exclude && exclude.includes(from[0])) return null;
        return from[0];
      }

      let newItem = getRandomFromArr(from);
      while (newItem == activeItem || (exclude && exclude.includes(newItem))) {
        newItem = getRandomFromArr(from);
      }

      return newItem;
    };

    if (right) {
      // SelectedItems length decreases, incorrectlyAnswered does not change
      if (nSIL == 0) {
        return null;
      } else if (!betting && nSIL == nIAQL) {
        return selectNew(selectedItems);
      }
    } else {
      // SelectedItems length stays the same, incorrectlyAnswered increases
      // no way the game can end

      if (!betting && nSIL == nIAQL) {
        return selectNew(selectedItems);
      }
    }

    return selectNew(selectedItems, incorrectlyAnsweredQuestions);
  };

  // onAnswer updates the state of the game when the user answers a question.
  const onAnswer = (
    right: boolean,
    betAmount: number | undefined,
    response: string | undefined
  ) => {
    setTransitioning(true)
    setTimeout(() => {
      let scoreUpdate = 0;
      let nSIL = selectedItems.length;
      let nIAQL = incorrectlyAnsweredQuestions.length;

      if (settings.aiSentencePhase && gamePhase > 0) {
        nSIL = selectedItems.length - 1;
        // betAmount and response must be defined
        if (gamePhase == 1 && response) {
          if (right) {
            setDerivedSentences(prev => {
              let prevState = Object.assign({}, prev);
              prevState[answer] = {
                sentence: response
                  .toLowerCase()
                  .replace(answer.toLowerCase(), '____'),
                betAmount: betAmount,
                item: activeItem,
              };
              return prevState;
            });
          }
        } else if (gamePhase == 2) {
          if (right && Object.keys(derivedSentences).includes(answer)) {
            scoreUpdate = (right ? 1 : -1) * derivedSentences[answer].betAmount;
            // Remove object from derivedSentences
            delete derivedSentences[answer];
          }
        }

        setSelectedItems(removeFromArr(selectedItems, activeItem));
        setQuestionElapsed(prev => prev + 1);
      } else {
        if (right) {
          nSIL = selectedItems.length - 1;
          nIAQL =
            incorrectlyAnsweredQuestions.length -
            (incorrectlyAnsweredQuestions.includes(activeItem) ? 1 : 0);
          setSelectedItems(removeFromArr(selectedItems, activeItem));
          setQuestionElapsed(prev => prev + 1);
          if (incorrectlyAnsweredQuestions.includes(activeItem)) {
            setIncorrectlyAnsweredQuestions(
              removeFromArr(incorrectlyAnsweredQuestions, activeItem)
            );
          } else {
            scoreUpdate = betting && betAmount ? betAmount : 1000;
          }
        } else {
          nSIL = selectedItems.length;
          nIAQL =
            incorrectlyAnsweredQuestions.length +
            (incorrectlyAnsweredQuestions.includes(activeItem) ? 0 : 1);
          if (!incorrectlyAnsweredQuestions.includes(activeItem)) {
            setIncorrectlyAnsweredQuestions(prev => [...prev, activeItem]);
          }

          if (betting && betAmount) {
            scoreUpdate = -betAmount;
          }

          if (selectedItems.length == 1 && possibleAnswers.length > 0) {
            let newPossibleAnswers = possibleAnswers;
            shuffleArray(newPossibleAnswers);
            setPossibleAnswers(newPossibleAnswers);
          }
        }
      }

      // gamePhase 0 -> no betting
      // gamePhase 1 -> betting, end early
      // gamePhase 2 -> no betting but add prev scores, only select based on correct sentences
      setPreviousScore(prev => prev + scoreUpdate);
      if (betting && (score + scoreUpdate <= 0 || nSIL - nIAQL <= 0)) {
        partReset();
        setTransitioning(false)
        return;
      }

      let nextItem = genNewItem(right, nSIL, nIAQL);
      setScore(prev => prev + scoreUpdate);
      setTimerElapsed(0);
      setActiveItem(nextItem);
      setTransitioning(false)
    }, 500);
  };

  // partReset resets the state of the game when the stage changes.
  const partReset = () => {
    let newGamePhase = gamePhase + 1;
    setGamePhase(newGamePhase);
    if (settings.aiSentencePhase && newGamePhase == 2) {
      // Set selected items to properly genned sentences
      let newSelectedItems = Object.values(derivedSentences).map(it => it.item);
      setSelectedItems(newSelectedItems);
      setActiveItem(getRandomFromArr(newSelectedItems));
    } else {
      setSelectedItems(originalSelectedItems);
      setActiveItem(getRandomFromArr(originalSelectedItems));
    }
    setQuestion('');
    setAnswer('');
    setIncorrectlyAnsweredQuestions([]);
    setQuestionElapsed(0);
    setTimerElapsed(0);
  };

  // fullReset resets the game when the user exits or they finish.
  const fullReset = () => {
    setGamePhase(0);
    setGameStarted(false);
    setOriginalSelectedItems([]);
    setIncorrectlyAnsweredQuestions([]);
    setActiveItem(null);
    setAnswer('');
    setScore(0);
    setText(false);
    setBetting(false);
    setPossibleAnswers([]);
    setSelectedItems([]);
    setTimerTotal(0);
    setTimerElapsed(0);
    setQuestionElapsed(0);
    setQuestionTotal(0);
  };

  const onClose = () => {
    setPreviousScore(undefined);
    fullReset();
  };

  const onSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    if (!selectedItems) {
      return;
    }

    setAllResponses(getResponses(quizletSet));
    setAllDefinitions(getDefinitions(quizletSet));
  }, [selectedItems]);

  useEffect(() => {
    setShowFinishCard(!gameStarted && previousScore != undefined && !Number.isNaN(previousScore))
  }, [previousScore, gameStarted])

  useEffect(() => {
    if (!activeItem) {
      if (
        gameStarted &&
        ((gamePhase == 2 && settings.aiSentencePhase) ||
          (gamePhase == 1 && !settings.aiSentencePhase))
      ) {
        partReset();
      }
      return;
    }

    let card = extractCard(activeItem);
    setQuestionImage(card.image);
    if (settings.aiSentencePhase && gamePhase > 0) {
      if (gamePhase == 1) {
        setQuestion('Use this word in a sentence: ' + card.answer);
        setAnswer(card.answer);
      } else if (
        gamePhase == 2 &&
        Object.keys(derivedSentences).includes(card.answer)
      ) {
        setQuestion(derivedSentences[card.answer].sentence);
        setAnswer(card.answer);
      }
    } else {
      if (settings.answerWithTerm) {
        setQuestion(card.question);
        setAnswer(card.answer);
      } else {
        setQuestion(card.answer)
        setAnswer(card.question)
      }
    }
  }, [activeItem, gamePhase]);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    updateCount();
    return () => {
      clearInterval(timer);
    };
  }, [activeItem, timerElapsed, timerTotal]);

  useEffect(() => {
    if (!text && answer != '') {
      let possibleAnsws = [];
      if (settings.aiGeneratedOptions) {
        if (settings.answerWithTerm) {
          possibleAnsws = [...aiOptions(answer, question), answer];
        } else {
          possibleAnsws = [...aiReverseOptions(answer, question), answer];
        }
      } else {
        if (settings.answerWithTerm) {
          possibleAnsws = genPossibleAnswers(allResponses, answer);
        } else {
          possibleAnsws = genPossibleAnswers(allDefinitions, answer);
        }
      }

      shuffleArray(possibleAnsws);
      setPossibleAnswers(possibleAnsws);
    }
  }, [answer, gamePhase, text]);

  useEffect(() => {
    if (questionTotal > 0 && questionElapsed == questionTotal) {
      partReset();
    }
  }, [questionElapsed]);

  useEffect(() => {
    if (
      (gamePhase == 1 && score == 0) ||
      (settings.aiSentencePhase && gamePhase >= 3) ||
      (!settings.aiSentencePhase && gamePhase >= 2)
    ) {
      fullReset();
    }

    setTimeout(() => {
      setText(gamePhase == 1);
      setBetting(gamePhase == 1);
    }, 250);
  }, [gamePhase, score]);

  return (
    <div className="main">
      {showSettings && (
        <Settings
          onClose={onSettingsClick}
          settings={settings}
          setSettings={setSettings}
          selectedSet={quizletSetIdx}
        />
      )}
      {gameStarted ? (
        <>
          <Header
            onClose={onClose}
            onSettingsClick={onSettingsClick}
            timerTotal={timerTotal}
            timerElapsed={timerElapsed}
            questionTotal={questionTotal}
            questionElapsed={questionElapsed}
          />
          {activeItem && (
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={activeItem.id}
                nodeRef={nodeRef}
                classNames="fade"
                addEndListener={done =>
                  nodeRef.current.addEventListener('transitionend', done, false)
                }
              >
                <div ref={nodeRef}>
                  <TermInfo
                    question={question}
                    questionImage={questionImage}
                    score={score}
                  />
                  <Response
                    transitioning={transitioning}
                    answer={answer}
                    isAI={settings.aiSentencePhase}
                    derivedSentences={derivedSentences}
                    betting={betting}
                    score={score}
                    onAnswer={onAnswer}
                    text={text}
                    possibleAnswers={possibleAnswers}
                    correctAnswer={
                      text ? answer : possibleAnswers.indexOf(answer)
                    }
                  />
                </div>
              </CSSTransition>
            </SwitchTransition>
          )}
        </>
      ) : (
        <>
          {showFinishCard ? (
            <FinishCard previousScore={previousScore} onReturn={() => setShowFinishCard(false)} />
          ) : (
            <StartCard
              quizletSet={quizletSetIdx}
              setQuizletSet={onSetQuizletSet}
              onSettingsClick={onSettingsClick}
              onStart={onStart}
            />
          )}
          
        </>
      )}
    </div>
  );
}
