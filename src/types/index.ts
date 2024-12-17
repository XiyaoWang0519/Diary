export interface User {
  id: string;
  isPremium: boolean;
}

export interface DiaryEntry {
  id?: number;
  content: string;
  enhanced_content?: string;
  created_at: string;
  context?: {
    analysis: string;
    entry_count: number;
  };
  user_id: string;
}

export interface VoiceState {
  isRecording: boolean;
  error: string | null;
  results: string[];
}

export interface MockWebSocket {
  onopen: ((ev: Event) => void) | null;
  onerror: ((ev: Event | Error) => void) | null;
  onmessage: ((ev: MessageEvent) => void) | null;
  send: jest.Mock;
  close: jest.Mock;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
      toBeDefined(): R;
      toBe(expected: any): R;
    }
  }
}
