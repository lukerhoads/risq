export interface Settings {
  batchSize: number;
  questionDuration: number;
  aiGeneratedOptions: boolean;
  aiSentencePhase: boolean;
}

export const defaultSettings: Settings = {
  batchSize: 5,
  questionDuration: 10,
  aiGeneratedOptions: false,
  aiSentencePhase: false,
};
