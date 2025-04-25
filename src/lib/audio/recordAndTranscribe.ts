export async function recordAndTranscribe(): Promise<string> {
  console.log("🟢 Starting new mic recording...");

  let stream: MediaStream;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      }
    });
  } catch (err) {
    alert("Microphone access is required.");
    throw new Error("Microphone access denied");
  }

  return new Promise((resolve, reject) => {
    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onerror = (e) => {
      stream.getTracks().forEach(t => t.stop());
      reject(e.error);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());

      const blob = new Blob(chunks, { type: 'audio/webm' });

      console.log("🛑 Mic stopped. Blob size:", blob.size);

      if (blob.size < 1000) {
        console.warn("🧘 Blob too small — probably silence");
        return resolve("...");
      }

      if (blob.size > 1000000) {
        console.warn("⚠️ Blob too big — possible system audio or long capture");
        return reject(new Error("Audio capture too long or incorrect input."));
      }

      const formData = new FormData();
      formData.append("file", blob, "audio.webm");
      formData.append("model", "whisper-1");

      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const { text } = await response.json();
        console.log("📝 Transcription result:", text);
        resolve(text);
      } catch (err) {
        console.error("❌ Error sending to /api/transcribe", err);
        reject(err);
      }
    };

    setTimeout(() => {
      mediaRecorder.start();
      console.log("🎙️ Recording for 5 seconds...");
      setTimeout(() => mediaRecorder.stop(), 5000);
    }, 250); // small buffer before start
  });
}
