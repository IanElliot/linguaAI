'use client';

import { useState, useRef } from 'react';
import { Select, MenuItem, IconButton, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import MicVisualizer from '@/lib/components/MicVisualizer';
import { runConversationLoop, stopAudioPlayback } from '@/lib/conversation/runConversationLoop';


const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 400,
    },
  },
});

export default function Home() {
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [desiredLanguage, setDesiredLanguage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const isRunningRef = useRef(false);

  const startConversation = async () => {
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(micStream);
    isRunningRef.current = true;
    setIsRunning(true);
    await runConversationLoop({
      stream: micStream,
      nativeLanguage,
      learningLanguage: desiredLanguage,
      setResponseText,
      isRunningRef,
    });
  };

  const stopConversation = () => {
    isRunningRef.current = false;
    stopAudioPlayback(); // 🛑 Cut off voice
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsRunning(false);
  };

  const isLanguageSelectionComplete = nativeLanguage && desiredLanguage;

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#f5f5dc', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box position="absolute" top="20px" left="20px">
          <Typography variant="h4" style={{ color: 'orange' }}>LinguaAI</Typography>
          <Typography variant="subtitle1" style={{ color: '#666666' }}>Your conversational language assistant</Typography>
        </Box>
        
        <Box display="flex" flexDirection="column" alignItems="center" maxWidth="600px" width="100%" padding="20px">
          <Box display="flex" justifyContent="center" marginBottom="20px">
            <Select 
              value={nativeLanguage} 
              onChange={(e) => setNativeLanguage(e.target.value)} 
              style={{ marginRight: '10px', width: '200px', backgroundColor: 'white' }}
              displayEmpty
              renderValue={(value) => {
                if (!value) return <span style={{ color: '#000000' }}>Select Native Language</span>;
                return <span style={{ color: '#000000' }}>{value === 'en' ? 'English' : 'Spanish'}</span>;
              }}
              disabled={isRunning}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </Select>
            <Select 
              value={desiredLanguage} 
              onChange={(e) => setDesiredLanguage(e.target.value)}
              style={{ width: '200px', backgroundColor: 'white' }}
              displayEmpty
              renderValue={(value) => {
                if (!value) return <span style={{ color: '#000000' }}>Select Desired Language</span>;
                return <span style={{ color: '#000000' }}>{value === 'en' ? 'English' : 'Spanish'}</span>;
              }}
              disabled={isRunning}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </Select>
          </Box>
          
          {responseText && (
            <Box 
              padding="15px" 
              marginBottom="20px" 
              bgcolor="white" 
              borderRadius="10px"
              width="100%"
              style={{ wordWrap: 'break-word' }}
            >
              <Typography style={{ fontFamily: 'Times New Roman, serif', color: '#000000' }}>{responseText}</Typography>
            </Box>
          )}

          {stream && isRunning && (
            <Box marginBottom="20px">
              <MicVisualizer stream={stream} />
            </Box>
          )}

          <IconButton 
            style={{ 
              backgroundColor: isRunning ? 'red' : (isLanguageSelectionComplete ? 'orange' : '#cccccc'), 
              color: 'white', 
              width: '60px', 
              height: '60px',
              transition: 'background-color 0.3s'
            }}
            onClick={isRunning ? stopConversation : startConversation}
            disabled={!isLanguageSelectionComplete}
          >
            {isRunning ? <StopIcon /> : <MicIcon />}
          </IconButton>

          {isRunning && <Typography style={{ marginTop: '10px', color: '#000000' }}>Session active. Click to stop.</Typography>}
        </Box>
      </div>
    </ThemeProvider>
  );
}
