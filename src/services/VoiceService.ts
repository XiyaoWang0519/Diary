import Config from 'react-native-config';
import { getOpenAIKey } from '../utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

class VoiceService {
  private static instance: VoiceService;
  private apiKey: string;
  private isRecording: boolean = false;
  private ws: WebSocket | null = null;

  private constructor() {
    this.apiKey = getOpenAIKey();
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public async isPremiumUser(): Promise<boolean> {
    try {
      const isPremium = await AsyncStorage.getItem('isPremiumUser');
      return isPremium === 'true';
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  private onSpeechResults(event: SpeechResultsEvent) {
    if (event.value && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'response.create',
        response: {
          modalities: ['text'],
          instructions: event.value[0],
        }
      }));
    }
  }

  private onSpeechError(error: SpeechErrorEvent) {
    console.error('Speech recognition error:', error);
  }

  public async startRecording(): Promise<void> {
    if (!(await this.isPremiumUser())) {
      throw new Error('Premium subscription required for voice features');
    }

    try {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.ws = await this.initializeVoiceConnection();
      }
      await Voice.start('en-US');
      this.isRecording = true;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      throw error;
    }
  }

  public async stopRecording(): Promise<void> {
    try {
      await Voice.stop();
      this.isRecording = false;
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      throw error;
    }
  }

  // Initialize WebSocket connection for real-time voice
  private async initializeVoiceConnection(): Promise<WebSocket> {
    const url = "wss://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";

    const ws = new WebSocket(
      `${url}?model=${model}`,
      [
        "realtime",
        `openai-insecure-api-key.${this.apiKey}`,
        "openai-beta.realtime-v1"
      ]
    );

    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log('Voice connection established');
        resolve(ws);
      };

      ws.onerror = (error) => {
        console.error('Voice connection error:', error);
        reject(error);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
      };
    });
  }

  public async destroy(): Promise<void> {
    try {
      await Voice.destroy();
      this.ws?.close();
      this.ws = null;
    } catch (error) {
      console.error('Error destroying Voice instance:', error);
    }
  }
}

export default VoiceService;
