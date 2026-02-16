export enum AppTab {
  Learn = 'learn',
  ImageGen = 'image-gen',
  VideoGen = 'video-gen',
}

export enum VocabLevel {
  CET4 = 'CET-4',
  CET6 = 'CET-6',
  IELTS = 'IELTS',
  GRE = 'GRE',
}

export interface WordItem {
  word: string;
  pronunciation?: string;
  definition_en: string;
  definition_cn: string;
  example: string;
  synonyms: string[];
}

export interface DailyStats {
  streak: number;
  lastCheckIn: string | null; // ISO Date string
  wordsLearned: number;
}

export interface ImageGenConfig {
  prompt: string;
  size: '1K' | '2K' | '4K';
}

export interface VideoGenConfig {
  prompt: string;
  imageBase64: string | null;
  aspectRatio: '16:9' | '9:16';
}

// Global declaration for the AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}