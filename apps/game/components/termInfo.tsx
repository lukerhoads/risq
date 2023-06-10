import { StudiableCardSideLabel, StudiableItem, SerializedMedia, SerializedMediaText, MediaType } from 'dataset/types';
import styles from '../styles/termInfo.module.scss'
import { useEffect, useState } from 'react';

interface TermInfoProps {
    question: string
    questionImage?: string 
    score: number
}

export default function TermInfo({ question, questionImage, score }: TermInfoProps) {
    return (
        <div className={styles.termInfo}>
            <h4>Score</h4>
            <h1>{score}</h1>
            <img src={questionImage} />
            <p>{question}</p>
        </div>
    )
}