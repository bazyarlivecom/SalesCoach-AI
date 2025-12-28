export interface TranscriptSegment {
  speaker: 'Salesperson' | 'Prospect' | 'Speaker A' | 'Speaker B';
  text: string;
  timestamp: string;
}

export interface SentimentPoint {
  time_seconds: number;
  label: string;
  score: number; // 0 to 100
}

export interface CoachingInsights {
  positives: string[];
  improvements: string[];
  summary: string;
}

export interface AnalysisResult {
  transcript: TranscriptSegment[];
  sentiment_curve: SentimentPoint[];
  coaching: CoachingInsights;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}