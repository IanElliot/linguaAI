// lib/components/MicVisualizer.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function MicVisualizer({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d')!;

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / bufferLength;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = 'orange';
      canvasCtx.fillRect(0, canvas.height - volume, canvas.width, volume);

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      audioCtx.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} width={300} height={60} style={{ background: '#fff', borderRadius: '10px' }} />;
}
