export type AppLanguage = 'hy' | 'ru';

export type AppScreen =
  | 'language'
  | 'rules'
  | 'cards'
  | 'game-el-la'
  | 'game-dj-sort'
  | 'game-instrument-beat'
  | 'game-mix-challenge'
  | 'results';

export interface SpanishWord {
  word: string; // e.g. "libro" (without article) or with article if needed, but keeping them separate is better
  article: 'el' | 'la';
  translationRu: string;
  translationHy: string;
  isException: boolean;
  icon: string; // lucide icon name or emoji or custom drawing representation
  gender: 'masculino' | 'femenino';
}

export interface FeedbackMessage {
  es: string;
  ru: string;
  hy: string;
}

export interface QuizQuestion {
  id: string;
  type: 'select-article' | 'match-translation' | 'find-mistake' | 'word-to-image';
  wordObj: SpanishWord;
  promptRu: string;
  promptHy: string;
  options: string[]; // e.g., ["el", "la"] or translations
  correctAnswer: string;
}
