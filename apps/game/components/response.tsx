import { useEffect, useState } from 'react'
import styles from '../styles/response.module.scss'
import { closeEnough } from '../util/util'
import { aiSentenceGrade } from '../ai/mock'

type DerivedSentence = {
    sentence: string,
    betAmount: number
}
type DerivedSentences = {
    [term: string]: DerivedSentence,
}

interface ResponseProps {
    score: number,
    text: boolean
    possibleAnswers: string[]
    correctAnswer: number | string
    onAnswer: (right: boolean, amount: number | undefined, response: string | undefined) => void
    betting: boolean
    derivedSentences: DerivedSentences
    isAI: boolean
    answer: string
}

export default function Response({ answer, isAI, derivedSentences, score, betting, text, possibleAnswers, onAnswer, correctAnswer }: ResponseProps) {
    if (!text && !possibleAnswers) return null 
    const [textResponse, setTextResponse] = useState("")
    const [betAmount, setBetAmount] = useState("")
    const [correctIdx, setCorrectIdx] = useState(null)
    const [incorrectIdx, setIncorrectIdx] = useState(null)
    const [correctText, setCorrectText] = useState(false)
    const [incorrectText, setIncorrectText] = useState(false)
    const [error, setError] = useState("")


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && text) {
            let betAmt = betAmount == "" ? 0 : parseInt(betAmount)
            if (betAmt > score) {
                setError("Bet amount higher than balance.")
                return
            }

            let correct = isAI ? aiSentenceGrade(answer, textResponse) : closeEnough(textResponse, correctAnswer) 
            console.log("Correct: ", correct)
            onAnswer(correct, betAmt, textResponse)
            if (correct) {
                setCorrectText(true)
            } else {
                setIncorrectText(true)
            }
        }
    }

    const onChoiceClicked = (idx) => {
        if (!text) {
            onAnswer(idx === correctAnswer)
            if (idx === correctAnswer) {
                setCorrectIdx(idx)
            } else {
                setCorrectIdx(correctAnswer)
                setIncorrectIdx(idx)
            }
        }

        setTimeout(() => {
            setCorrectIdx(null)
            setIncorrectIdx(null)
        }, 500)
    }

    const verifyAndSetBet = (e) => {
        let bet = e.target.value 
        if (Number.isNaN(bet)) {
            setError("Bet invalid number")
            return
        }

        setBetAmount(bet)
    }

    return (
        <div className={styles.responseContainer}>
            <div className={styles.response}>
                { text ? (
                    <div className={styles.responseInput}>
                        <input autoFocus placeholder="Response" value={textResponse} onChange={(e) => setTextResponse(e.target.value)} onKeyDown={handleKeyPress} className={`${correctText ? styles.greenInput : ""} ${incorrectText ? styles.redInput : ""}`} />
                        {betting && <input placeholder="Bet amount" value={betAmount} onChange={verifyAndSetBet} onKeyDown={handleKeyPress} />}
                        {error != "" && <p className={styles.error}>{error}</p>}
                    </div>
                ) : (
                    <>
                        {possibleAnswers.map((possibleAnswer, idx) => {
                            return (
                                <div key={idx} onClick={() => onChoiceClicked(idx)} className={`${styles.possibleAnswer} ${correctIdx != null && correctIdx == idx ? styles.green : ""} ${incorrectIdx != null && incorrectIdx == idx ? styles.red : ""}`}>
                                    {possibleAnswer}
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
        </div>
    )
}