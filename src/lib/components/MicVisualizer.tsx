// lib/components/MicVisualizer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface MicVisualizerProps {
  stream: MediaStream | null;
  isSpeaking?: boolean;
}

export default function MicVisualizer({ stream, isSpeaking = false }: MicVisualizerProps) {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const micLoggerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!stream) return;
  
    // Create one audio context and analyser
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0;
  
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
  
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
  
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
  
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedVolume = Math.min(average / 32, 1);
  
      setVolume(normalizedVolume);
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };
  
    updateVolume();
  
    // Mic track debug
    console.log('[LinguaAI] Mic stream tracks:', stream.getTracks());
    stream.getAudioTracks().forEach(track => {
      console.log('[LinguaAI] Audio track muted:', track.muted, 'enabled:', track.enabled, 'readyState:', track.readyState);
      track.onmute = () => console.warn('[LinguaAI] Audio track muted');
      track.onunmute = () => console.log('[LinguaAI] Audio track unmuted');
      track.onended = () => console.warn('[LinguaAI] Audio track ended');
    });
  
    // Volume logger
    micLoggerIntervalRef.current = setInterval(() => {
      analyser.getByteTimeDomainData(dataArray);
      const rawAvg = dataArray.reduce((a, b) => a + b) / dataArray.length;
      console.log('[LinguaAI] Mic average volume (raw):', rawAvg);
    }, 1000);
  
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (micLoggerIntervalRef.current) clearInterval(micLoggerIntervalRef.current);
      audioContext.close();
    };
  }, [stream]);

  // Calculate circle size and glow based on volume
  const size = stream 
    ? 80 + volume * 40 // 80px to 120px based on volume (reduced max size)
    : 80; // Fixed size when inactive

  const glowIntensity = stream
    ? 5 + volume * 20 // 5px to 25px glow based on volume
    : 5; // Subtle glow when inactive

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '150px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: stream
            ? 'linear-gradient(45deg, #ff6b6b, #ffa726, #ffd54f)'
            : '#e0e0e0',
          backgroundSize: '400% 400%',
          boxShadow: `0 0 ${glowIntensity}px ${stream ? 'rgba(255, 107, 107, 0.5)' : 'rgba(224, 224, 224, 0.3)'}`,
          transition: 'all 0.05s ease-out', // Faster transitions for more responsive feel
          animation: stream ? 'gradientShift 8s ease infinite' : 'none',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      />
    </Box>
  );
}
