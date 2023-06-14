import { useEffect, useState } from 'react';
import { Settings as SettingsType, defaultSettings } from '../types/settings';
import styles from '../styles/settings.module.scss';
import xIcon from '../icons/x.svg';
import Image from 'next/image';
import ToggleSwitch from './toggleSwitch';

interface SettingsProps {
  settings: SettingsType;
  setSettings: (newSettings: SettingsType) => void;
  onClose: () => void;
  selectedSet: number
}

export default function Settings({
  settings,
  setSettings,
  onClose,
  selectedSet,
}: SettingsProps) {
  const [batchSize, setBatchSize] = useState(settings.batchSize.toString());
  const [questionDuration, setQuestionDuration] = useState(
    settings.questionDuration.toString()
  );
  const [aiGeneratedOptions, setAIGeneratedOptions] = useState(
    settings.aiGeneratedOptions
  );
  const [aiSentencePhase, setAISentencePhase] = useState(
    settings.aiSentencePhase
  );
  const [answerWithTerm, setAnswerWithTerm] = useState(settings.answerWithTerm);
  const [error, setError] = useState('')

  useEffect(() => {
    let newAiGeneratedOptions = aiGeneratedOptions

    if (selectedSet != 0 && newAiGeneratedOptions) {
      newAiGeneratedOptions = false
      setAIGeneratedOptions(false)
      setError("No support for AI generated options for sets other than Disney Princesses")
    }

    let batchSizeParsed = parseInt(batchSize);
    if (Number.isNaN(batchSizeParsed)) {
      batchSizeParsed = 0;
    }

    let questionDurationParsed = parseInt(questionDuration);
    if (Number.isNaN(questionDurationParsed)) {
      questionDurationParsed = 0;
    }

    setSettings({
      batchSize: batchSizeParsed,
      questionDuration: questionDurationParsed,
      aiGeneratedOptions: newAiGeneratedOptions,
      aiSentencePhase: aiSentencePhase,
      answerWithTerm: answerWithTerm,
    });
  }, [
    batchSize,
    questionDuration,
    aiGeneratedOptions,
    aiSentencePhase,
    answerWithTerm,
  ]);

  return (
    <div className={styles.settings}>
      <div className={styles.settingsHeader}>
        <h1>Settings</h1>
        <button onClick={() => onClose()}>
          <Image alt="close" src={xIcon} />
        </button>
      </div>
      <div className={styles.option}>
        <label htmlFor="batch size">Question batch size</label>
        <input
          placeholder="batch size"
          value={batchSize}
          onChange={e => setBatchSize(e.target.value)}
        />
      </div>
      <div className={styles.option}>
        <label htmlFor="checkbox">Question duration (s)</label>
        <input
          placeholder="question duration (s)"
          value={questionDuration}
          onChange={e => setQuestionDuration(e.target.value)}
        />
      </div>
      <div className={styles.toggleContainer}>
        <p>AI Generated Options:</p>
        <ToggleSwitch
          value={aiGeneratedOptions}
          toggleValue={() => setAIGeneratedOptions(!aiGeneratedOptions)}
        />
      </div>
      <div className={styles.toggleContainer}>
        <p>AI Sentence Phase:</p>
        <ToggleSwitch
          value={aiSentencePhase}
          toggleValue={() => setAISentencePhase(!aiSentencePhase)}
        />
      </div>
      <div className={styles.toggleContainer}>
        <p>Answer with term:</p>
        <ToggleSwitch
          value={answerWithTerm}
          toggleValue={() => setAnswerWithTerm(!answerWithTerm)}
        />
      </div>
      {error && <p className={styles.red}>{error}</p>}
    </div>
  );
}
