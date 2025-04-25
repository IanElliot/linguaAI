export async function recordUntilSilent(stream: MediaStream): Promise<string> {
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus'
  });

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const chunks: Blob[] = [];
  let silenceTimer: number | null = null;
  const silenceThreshold = 0.01;
  const silenceDelay = 1500; // ms

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onerror = (e) => {
    audioCtx.close();
    throw e.error;
  };

  const checkSilence = () => {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

    if (volume < silenceThreshold * 255) {
      if (silenceTimer === null) {
        silenceTimer = window.setTimeout(() => {
          mediaRecorder.stop();
        }, silenceDelay);
      }
    } else {
      if (silenceTimer !== null) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    }

    if (mediaRecorder.state === 'recording') {
      requestAnimationFrame(checkSilence);
    }
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = async () => {
      audioCtx.close();

      const blob = new Blob(chunks, { type: 'audio/webm' });

      if (blob.size < 1000) return resolve('...');

      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');

      try {
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          return resolve('...');
        }

        const { text } = await response.json();
        resolve(text);
      } catch (err) {
        reject(err);
      }
    };

    mediaRecorder.start();
    requestAnimationFrame(checkSilence);
  });
}
  