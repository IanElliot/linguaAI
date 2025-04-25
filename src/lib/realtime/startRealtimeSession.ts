type SessionOptions = {
  system_instruction: string;
  onTranscript: (text: string) => void;
  onResponse: (text: string) => void;
};

export async function startRealtimeSession(options: SessionOptions): Promise<void> {
  console.log("Mock: Starting real-time session with system prompt:");
  console.log(options.system_instruction);
} 