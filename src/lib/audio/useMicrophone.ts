/**
 * Gets access to the user's microphone
 * @returns A Promise that resolves to a MediaStream
 * @throws Error if microphone access is denied or unavailable
 */
export async function getUserMediaStream(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (err) {
    console.error("Microphone access denied or unavailable", err);
    throw err;
  }
} 