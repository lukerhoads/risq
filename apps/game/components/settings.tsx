import { useEffect, useState } from 'react';
import { Settings as SettingsType, defaultSettings } from '../types/settings';
import styles from '../styles/settings.module.scss';
import xIcon from '../icons/x.svg';
import Image from 'next/image';

interface SettingsProps {
  settings: SettingsType;
  setSettings: (newSettings: SettingsType) => void;
  onClose: () => void;
}

export default function Settings({
  settings,
  setSettings,
  onClose,
}: SettingsProps) {
  const [batchSize, setBatchSize] = useState(settings.batchSize.toString());
  const [questionDuration, setQuestionDuration] = useState(
    settings.questionDuration.toString()
  );
  const [aiGeneratedOptions, setAiGeneratedOptions] = useState(
    settings.aiGeneratedOptions
  );
  const [aiSentencePhase, setaiSentencePhase] = useState(
    settings.aiSentencePhase
  );

  useEffect(() => {
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
      aiGeneratedOptions: aiGeneratedOptions,
      aiSentencePhase: aiSentencePhase,
    });
  }, [batchSize, questionDuration, aiGeneratedOptions, aiSentencePhase]);

  return (
    <div className={styles.settings}>
      <div className={styles.settingsHeader}>
        <h1>Settings</h1>
        <button onClick={() => onClose()}>
          <Image alt="close" src={xIcon} />
        </button>
      </div>
      <label htmlFor="batch size">Question batch size</label>
      <input
        placeholder="batch size"
        value={batchSize}
        onChange={e => setBatchSize(e.target.value)}
      />
      <label htmlFor="checkbox">Question duration (s)</label>
      <input
        placeholder="question duration (s)"
        value={questionDuration}
        onChange={e => setQuestionDuration(e.target.value)}
      />
      <label htmlFor="checkbox">AI Generated Options</label>
      <input
        type="checkbox"
        checked={aiGeneratedOptions}
        onChange={() => setAiGeneratedOptions(!aiGeneratedOptions)}
      />
      <label htmlFor="checkbox">AI Sentence Phase</label>
      <input
        type="checkbox"
        checked={aiSentencePhase}
        onChange={() => setaiSentencePhase(!aiSentencePhase)}
      />
    </div>
  );
}
