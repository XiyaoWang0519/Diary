import VoiceService from '../VoiceService';
import { getOpenAIKey } from '../../utils/env';
import { MockWebSocket } from '../../types';

// Mock react-native-config
jest.mock('react-native-config', () => ({
  OPENAI_API_KEY: 'test-api-key'
}));

// Mock WebSocket
const mockWebSocket: MockWebSocket = {
  onopen: null,
  onerror: null,
  onmessage: null,
  send: jest.fn(),
  close: jest.fn(),
};

// Cast WebSocket mock to correct type
(global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);

describe('VoiceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize WebSocket connection with correct parameters', async () => {
    const service = VoiceService.getInstance();
    const connectionPromise = service.initializeVoiceConnection();

    // Simulate successful connection
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }

    const ws = await connectionPromise;
    expect(ws).toBeDefined();
    expect(global.WebSocket).toHaveBeenCalledWith(
      expect.stringContaining('wss://api.openai.com/v1/realtime'),
      expect.arrayContaining([
        'realtime',
        expect.stringContaining('openai-insecure-api-key'),
        'openai-beta.realtime-v1'
      ])
    );
  });

  it('should handle connection errors', async () => {
    const service = VoiceService.getInstance();
    const connectionPromise = service.initializeVoiceConnection();

    // Simulate connection error
    if (mockWebSocket.onerror) {
      mockWebSocket.onerror(new Error('Connection failed'));
    }

    await expect(connectionPromise).rejects.toThrow();
  });
});
