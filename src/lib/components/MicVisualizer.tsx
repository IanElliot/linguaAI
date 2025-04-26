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
    analyserRef.current.fftSize = 128; // Smaller FFT size for faster processing
    analyserRef.current.smoothingTimeConstant = 0; // No smoothing for immediate response
    
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    const updateVolume = () => {
      if (!analyserRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Simplified volume calculation for better performance
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedVolume = Math.min(average / 32, 1); // More sensitive to lower volumes
      
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
