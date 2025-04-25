// src/lib/conversation/runConversationLoop.ts
import { recordUntilSilent } from '@/lib/audio/recordUntilSilent';

let currentAudio: HTMLAudioElement | null = null;

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
        console.warn("⚠️ Skipping empty or silence-only transcript.");
        continue;
      }
      
      console.log("⏳ Sending transcript to GPT..."); // Add this!

    try {
      setResponseText("⏳ Thinking...");

      const response = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeLanguage,
          learningLanguage,
          transcript,
        }),
      });

      if (!isRunningRef.current) break;

      const { reply } = await response.json();
      console.log("🧠 Reply:", reply);
      setResponseText(reply);

      const audioRes = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply }),
      });

      if (!isRunningRef.current) break;

      const audioBlob = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudio = audio; // Save reference for cancellation

      console.log("🔊 Playing audio...");
      await audio.play();
      await new Promise((res) => (audio.onended = res));

      currentAudio = null;
    } catch (err) {
      console.error("❌ Error in GPT or TTS:", err);
      setResponseText("Something went wrong. Please try again.");
      break;
    }
  }
}

export function stopAudioPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
    console.log("⛔ Audio playback interrupted.");
  }
}
