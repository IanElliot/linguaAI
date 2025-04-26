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
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!stream) return;

    // Initialize audio context and analyzer
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    const updateVolume = () => {
      if (!analyserRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedVolume = Math.min(average / 128, 1); // Normalize to 0-1 range
      
      setVolume(normalizedVolume);
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stream]);

  // Calculate circle size and glow based on volume or isSpeaking prop
  const size = stream 
    ? (isSpeaking 
      ? 80 + Math.sin(Date.now() / 500) * 10 // Pulsing effect for AI speaking
      : 60 + volume * 40) // 60px to 100px based on volume
    : 60; // Fixed size when inactive

  const glowIntensity = stream
    ? (isSpeaking
      ? 20 + Math.sin(Date.now() / 500) * 5 // Pulsing glow for AI speaking
      : 10 + volume * 15) // 10px to 25px glow based on volume
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
          transition: 'all 0.3s ease-out',
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
