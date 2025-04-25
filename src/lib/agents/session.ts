import { createSystemPrompt } from './createSystemPrompt';
import { startRealtimeSession } from '../realtime/startRealtimeSession';

/**
 * Initializes a language learning session with OpenAI
 */
export async function initializeLinguaSession(nativeLanguage: string, learningLanguage: string) {
  const prompt = createSystemPrompt(nativeLanguage, learningLanguage);

  await startRealtimeSession({
    system_instruction: prompt,
    onTranscript: (text) => {
      console.log("User said:", text);
    },
    onResponse: (text) => {
      console.log("AI says:", text);
    },
  });
} 