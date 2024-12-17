import Config from 'react-native-config';

export const getOpenAIKey = (): string => {
  const key = Config.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key not found in environment variables');
  }
  return key;
};
