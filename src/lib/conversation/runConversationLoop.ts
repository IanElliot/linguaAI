import { recordUntilSilent } from '@/lib/audio/recordUntilSilent';
import { ConversationMemory, MessageTurn } from '@/lib/conversation/ConversationMemory';
import { CorrectionManager } from '@/lib/conversation/CorrectionManager';
import { GoalManager } from '@/lib/conversation/GoalManager';
// import { SpeedTracker } from '@/lib/conversation/SpeedTracker'; // Optional for now

let currentAudio: HTMLAudioElement | null = null;

// Initialize managers
const memory = new ConversationMemory();
const correctionManager = new CorrectionManager();
const goalManager = new GoalManager();
// const speedTracker = new SpeedTracker(); // Optional if you want early tracking

export async function runConversationLoop({
  stream,
  nativeLanguage,
  learningLanguage,
  setResponseText,
  isRunningRef,
}: {
  stream: MediaStream;
  nativeLanguage: string;
  learningLanguage: string;
  setResponseText: (text: string) => void;
  isRunningRef: React.MutableRefObject<boolean>;
}): Promise<void> {
  while (isRunningRef.current) {
    console.log("🔁 Listening for user input...");

    let transcript: string;

    try {
      transcript = await recordUntilSilent(stream);
      console.log("📥 Transcript captured:", transcript);
    } catch (err) {
      console.error("❌ Error during transcription:", err);
      break;
    }

    if (!isRunningRef.current) break;

    if (!transcript || transcript.trim() === '...') {
      console.warn("⚠️ Skipping empty or silent input");
      continue;
    }

    // Save user input
    memory.addTurn({ role: 'user', text: transcript });

    // Check if correction is needed
    let agentResponse: string;

    if (correctionManager.shouldCorrect(transcript)) {
      agentResponse = correctionManager.getCorrection(transcript);
    } else {
      // Generate agent response normally
      agentResponse = await generateAgentResponse({
        transcript,
        memory,
        goalManager,
        nativeLanguage,
        learningLanguage,
      });
    }

    // Save agent response
    memory.addTurn({ role: 'agent', text: agentResponse });

    // (Optional) Track hesitations or error rates
    // if (transcript.includes("uh") || transcript.includes("um")) {
    //   speedTracker.registerHesitation();
    // }

    // Speak & display response
    await speak(agentResponse, learningLanguage);
    setResponseText(agentResponse);
  }
}

// 🛠️ Mockup: Replace this with your real agent call
async function generateAgentResponse({
  transcript,
  memory,
  goalManager,
  nativeLanguage,
  learningLanguage,
}: {
  transcript: string;
  memory: ConversationMemory;
  goalManager: GoalManager;
  nativeLanguage: string;
  learningLanguage: string;
}): Promise<string> {
  const goal = goalManager.getGoal();
  const lastFewTurns = memory.getRecentTurns();

  // Later, send goal + history into your LLM agent
  console.log("🎯 Current Goal:", goal);
  console.log("🧠 Recent Turns:", lastFewTurns);

  return `You said: "${transcript}". Let's keep going!`; // Placeholder agent response
}

// 🗣️ Mockup: Your real TTS function
async function speak(text: string, language: string) {
  console.log(`🎤 Speaking in ${language}:`, text);
}
