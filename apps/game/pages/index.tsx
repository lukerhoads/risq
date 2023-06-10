import Quizlet from 'dataset';
import Fun from 'dataset/sets/Fun';
import Header from '../components/header'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import {
  CardSide,
  MediaType,
  SerializedMedia,
  SerializedMediaImage,
  SerializedMediaText,
  StudiableItem,
  StudiableCardSideLabel
} from 'dataset/types';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import StartCard from '../components/startCard';
import TermInfo from '../components/termInfo';
import Response from '../components/response';
import { aiOptions, aiSentenceGrade } from '../ai/mock';
import { genRandomIndex, removeFromArr, shuffleArray } from '../util/util';
import { Settings as SettingsType, defaultSettings } from '../types/settings'
import Settings from '../components/settings';

// TODO:
// - AI Scoring mechanism:
//   - Second game phase - user creates sentences for every term, grade is yes or no based on proper usage of word
//   - Third game phase - multiple choice, questions are the sentences created. User awarded points they betted if they properly fill in the blank.
// - Scoring based on accuracy pctg rather than actual score (so doesn't have to be normalized)

export default function Game() {
  const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();
  let timer = null;
  
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const [allResponses, setAllResponses] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [timerElapsed, setTimerElapsed] = useState(0)
  const [timerTotal, setTimerTotal] = useState(0)
  const [questionElapsed, setQuestionElapsed] = useState(0)
  const [questionTotal, setQuestionTotal] = useState(0)
  const [originalSelectedItems, setOriginalSelectedItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [incorrectlyAnsweredQuestions, setIncorrectlyAnsweredQuestions] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [question, setQuestion] = useState("")
  const [questionImage, setQuestionImage] = useState("")
  const [answer, setAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [gamePhase, setGamePhase] = useState(0)
  const [text, setText] = useState(false)
  const [betting, setBetting] = useState(false)
  const [possibleAnswers, setPossibleAnswers] = useState([])
  const [previousScore, setPreviousScore] = useState(null)
  const [derivedSentences, setDerivedSentences] = useState({})

  const nodeRef = useRef(null)

  useEffect(() => {
    if (!selectedItems) {
      return
    }

    let allResps = []
    for (let item of quizletSet.studiableItem) {
      for (let entry of item.cardSides) {
        const { label, media } = entry
         if (label == StudiableCardSideLabel.WORD) {
            for (let med of media) {
                switch (med.type) {
                    case MediaType.TEXT:
                      allResps.push(med.plainText)
                }
            }
        }
      }
    }
    
    setAllResponses(allResps)
  }, [selectedItems])

  useEffect(() => {
    console.log("Active item: ", activeItem, gamePhase)
    if (!activeItem) {
      if (gameStarted) {
        // This is where we end the game
        if (gamePhase == 2 && settings.aiSentencePhase || gamePhase == 1 && !settings.aiSentencePhase) {
          console.log("Part resetting here")
          partReset()
        }
      }
      return
    }

    let newQuestion = ""
    let newQuestionImage = ""
    let newAnswer = ""
    for (let entry of activeItem.cardSides) {
      const { label, media } = entry
      if (label == StudiableCardSideLabel.DEFINITION) {
          for (let med of media) {
              switch (med.type) {
                  case MediaType.TEXT:
                      newQuestion = med.plainText
                  case MediaType.IMAGE:
                      newQuestionImage = med.url
              }
          }
      } else if (label == StudiableCardSideLabel.WORD) {
          for (let med of media) {
              switch (med.type) {
                  case MediaType.TEXT:
                      newAnswer = med.plainText
              }
          }
      }
    }

    console.log("Prev answer, newanswer", answer, newAnswer)
    setAnswer(newAnswer)
    setQuestionImage(newQuestionImage)
    if (settings.aiSentencePhase && gamePhase > 0) {
      if (gamePhase == 1) {
        setQuestion("Use this word in a sentence: " + newAnswer)
      } else if (gamePhase == 2) {
        // Set question to previously devised sentence 
        console.log("finding stored sentence for word ", newAnswer)
        if (Object.keys(derivedSentences).includes(newAnswer)) {
          setQuestion(derivedSentences[newAnswer].sentence)
        }
      }
    } else {
      setQuestion(newQuestion)
    }
  }, [activeItem, gamePhase])

  const updateCount = () => {
    timer = !timer && setInterval(() => {
      setTimerElapsed(timerElapsed + 1)
    }, 1000)

    if (timerElapsed === timerTotal) {
      onAnswer(false)
      clearInterval(timer)
    }
  }

  useEffect(() => {
    if (!activeItem) {
      return
    }

    updateCount()
    return () => {
      clearInterval(timer)
    }
  }, [activeItem, timerElapsed, timerTotal])

  useEffect(() => {
    console.log("Answer gen triggered")
    if (!text && answer != "") {
      let possibleAnsws  = []
      console.log("Generating possible answers for ", answer)
      if (settings.aiGeneratedOptions) {
        possibleAnsws = [ ...aiOptions(answer, question), answer ]
      } else {
        for (let i=0; i<3; i++) {
          let randomChoice = allResponses[genRandomIndex(allResponses.length)]
          if (allResponses.length > 2) {
            while (randomChoice == answer || possibleAnsws.includes(randomChoice)) {
              randomChoice = allResponses[genRandomIndex(allResponses.length)]
            }
          }

          possibleAnsws.push(randomChoice)
        }
        possibleAnsws.push(answer)
      }

      shuffleArray(possibleAnsws)
      setPossibleAnswers(possibleAnsws)
    }
  }, [answer, gamePhase])

  useEffect(() => {
    if (questionTotal > 0 && questionElapsed == questionTotal) {
      partReset()
    }
  }, [questionElapsed])

  const onStart = () => {
    let selectedTerms = []
    let maxAmount = settings.batchSize
    if (quizletSet.studiableItem.length < settings.batchSize) {
      maxAmount = quizletSet.studiableItem.length
    }
    while (selectedTerms.length < maxAmount) {
      let randomItem = quizletSet.studiableItem[genRandomIndex(quizletSet.studiableItem.length)]
      if (!selectedTerms.includes(randomItem)) {
        selectedTerms.push(randomItem)
      }
    }
    setDerivedSentences({})
    setTimerElapsed(0)
    setPreviousScore(0)
    setGameStarted(true)
    setSelectedItems(selectedTerms)
    setOriginalSelectedItems(selectedTerms)
    setTimerTotal(settings.questionDuration)
    setQuestionTotal(maxAmount)
    setActiveItem(selectedTerms[genRandomIndex(selectedItems.length)])
  }

  const genNewItem = (right: boolean, nSIL, nIAQL) => {
    if (settings.aiSentencePhase && gamePhase == 2) {
      let derivedKeys = Object.keys(derivedSentences)
      if (derivedKeys.length > 0) {
        return derivedSentences[derivedKeys[genRandomIndex(derivedKeys.length)]].item
      }

      return null
    }

    const selectNew = (from: any[], exclude?: any[]) => {
      if (from.length == 1) {
        if (exclude && exclude.includes(from[0])) return null
        return from[0]
      }

      let newItem = from[genRandomIndex(from.length)]
      while (newItem == activeItem || (exclude && exclude.includes(newItem))) {
        console.log("Forkbomb")
        newItem = from[genRandomIndex(from.length)]
      }

      return newItem
    }

    if (right) {
      // SelectedItems length decreases, incorrectlyAnswered does not change
      if (nSIL == 0) {
        return null
      } else if (!betting && nSIL == nIAQL) {
        return selectNew(selectedItems)
      } 
    } else {
      // SelectedItems length stays the same, incorrectlyAnswered increases
      // no way the game can end 
      
      if (!betting && nSIL == nIAQL) {
        return selectNew(selectedItems)
      }
    }

    return selectNew(selectedItems, incorrectlyAnsweredQuestions)
  }

  const onAnswer = (right: boolean, betAmount: number | undefined, response: string | undefined) => {
    // console.log("Right: ", right)
    // console.log("Bet amt: ", betAmount)
    // console.log("Selected items: ", selectedItems)
    // console.log("Incorrect items: ", incorrectlyAnsweredQuestions)
    setTimeout(() => {
      let scoreUpdate = 0
      let nSIL = selectedItems.length
      let nIAQL = incorrectlyAnsweredQuestions.length

      if (settings.aiSentencePhase && gamePhase > 0) {
        nSIL = selectedItems.length - 1
        // betAmount and response must be defined
        if (gamePhase == 1 && response) {
          if (right) {
            setDerivedSentences(prev => {
              let prevState = Object.assign({}, prev)
              prevState[answer] = {
                sentence: response.toLowerCase().replace(answer.toLowerCase(), "____"),
                betAmount: betAmount,
                item: activeItem,
              }
              return prevState
            })
          }
        } else if (gamePhase == 2) {
          if (right && Object.keys(derivedSentences).includes(answer)) {
            scoreUpdate = (right ? 1 : -1) * derivedSentences[answer].betAmount
            // Remove object from derivedSentences
            delete derivedSentences[answer]
          }
        }

        setSelectedItems(removeFromArr(selectedItems, activeItem))
        setQuestionElapsed(prev => prev + 1)
      } else {
        if (right) {
          nSIL = selectedItems.length - 1
          nIAQL = incorrectlyAnsweredQuestions.length - (incorrectlyAnsweredQuestions.includes(activeItem) ? 1 : 0)
          setSelectedItems(removeFromArr(selectedItems, activeItem))
          setQuestionElapsed(prev => prev + 1)
          if (incorrectlyAnsweredQuestions.includes(activeItem)) {
            setIncorrectlyAnsweredQuestions(removeFromArr(incorrectlyAnsweredQuestions, activeItem))
          } else {
            scoreUpdate = betting && betAmount ? betAmount : 1000 
          }
        } else {
          nSIL = selectedItems.length
          nIAQL = incorrectlyAnsweredQuestions.length + (incorrectlyAnsweredQuestions.includes(activeItem) ? 0 : 1)
          if (!incorrectlyAnsweredQuestions.includes(activeItem)) {
            setIncorrectlyAnsweredQuestions(prev => [ ...prev, activeItem ])
          }
  
          if (betting && betAmount) {
            scoreUpdate = -betAmount
          }
  
          // shouldn't we always shuffle?
          if (selectedItems.length == 1 && possibleAnswers.length > 0) {
            let newPossibleAnswers = possibleAnswers
            shuffleArray(newPossibleAnswers)
            setPossibleAnswers(newPossibleAnswers)
          } 
        }
      }

      // gamePhase 0 -> no betting
      // gamePhase 1 -> betting, end early
      // gamePhase 2 -> no betting but add prev scores, only select based on correct sentences
      setPreviousScore(prev => prev + scoreUpdate)
      if (betting && (score + scoreUpdate <= 0 || nSIL - nIAQL <= 0)) {
        console.log("Partial reset")
        partReset()
        return
      }

      let nextItem = genNewItem(right, nSIL, nIAQL)
      console.log("next item: ", nextItem)
      setScore(prev => prev + scoreUpdate)
      setTimerElapsed(0)
      setActiveItem(nextItem)
    }, 500)
  }

  useEffect(() => {
    if (gamePhase == 1 && score == 0 || settings.aiSentencePhase && gamePhase >= 3 || !settings.aiSentencePhase && gamePhase >= 2) {
      console.log("Full reset: ")
      fullReset()
    }

    setTimeout(() => {
      setText(gamePhase == 1)
      setBetting(gamePhase == 1)
    }, 250)
  }, [gamePhase, score])

  const partReset = () => {
    let newGamePhase = gamePhase + 1
    setGamePhase(newGamePhase)
    if (settings.aiSentencePhase && newGamePhase == 2) {
      // Set selected items to properly genned sentences
      setSelectedItems(Object.values(derivedSentences).map(it => it.item))
    } else {
      setSelectedItems(originalSelectedItems)
    }
    setQuestion("")
    setAnswer("")
    setIncorrectlyAnsweredQuestions([])
    setQuestionElapsed(0)
    setTimerElapsed(0)
    setActiveItem(originalSelectedItems[genRandomIndex(originalSelectedItems.length)])
  }

  const fullReset = () => {
    setGamePhase(0)
    setGameStarted(false)
    setOriginalSelectedItems([])
    setIncorrectlyAnsweredQuestions([])
    setActiveItem(null)
    setAnswer("")
    setScore(0)
    setText(false)
    setBetting(false)
    setPossibleAnswers([])
    setSelectedItems([])
    setTimerTotal(0)
    setTimerElapsed(0)
    setQuestionElapsed(0)
    setQuestionTotal(0)
  }

  const onClose = () => {
    fullReset()
  }

  const onSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  return (
    <div className="main">
      { showSettings && <Settings onClose={onSettingsClick} settings={settings} setSettings={setSettings} /> }
      { gameStarted ? (
        <>
          <Header onClose={onClose} onSettingsClick={onSettingsClick} timerTotal={timerTotal} timerElapsed={timerElapsed} questionTotal={questionTotal} questionElapsed={questionElapsed} />
          { activeItem && (
            <SwitchTransition mode="out-in">
              <CSSTransition key={activeItem.id} nodeRef={nodeRef} classNames="fade" addEndListener={(done) => nodeRef.current.addEventListener("transitionend", done, false)}>
                <div ref={nodeRef}>
                  <TermInfo question={question} questionImage={questionImage} score={score} />
                  <Response answer={answer} isAI={settings.aiSentencePhase} derivedSentences={derivedSentences} betting={betting} score={score} onAnswer={onAnswer} text={text} possibleAnswers={possibleAnswers} correctAnswer={text ? answer : possibleAnswers.indexOf(answer)} />
                </div>
              </CSSTransition>
            </SwitchTransition>
          )}
        </>
      ) : (
        <>
          <StartCard onSettingsClick={onSettingsClick} onStart={onStart} previousScore={previousScore} />
        </>
      )}
    </div>
  );
}
