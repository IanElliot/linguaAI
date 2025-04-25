'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Select, MenuItem, IconButton, Typography, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import MicVisualizer from '@/lib/components/MicVisualizer';
import { runConversationLoop, stopAudioPlayback } from '@/lib/conversation/runConversationLoop';

export default function Dashboard() {
  const { data: session } = useSession();
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
    stopAudioPlayback();
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsRunning(false);
  };

  const isLanguageSelectionComplete = nativeLanguage && desiredLanguage;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f9f6f1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 4,
    }}>
      <Box position="absolute" top="20px" left="20px">
        <Typography variant="h4" sx={{ color: 'primary.main' }}>LinguaAI</Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Welcome, {session?.user?.name}
        </Typography>
      </Box>
      
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        maxWidth="600px" 
        width="100%" 
        p={3}
      >
        <Box display="flex" justifyContent="center" mb={3}>
          <Select 
            value={nativeLanguage} 
            onChange={(e) => setNativeLanguage(e.target.value)} 
            sx={{ 
              mr: 1.5,
              width: '200px',
              bgcolor: 'white',
              '& .MuiSelect-select': {
                color: 'text.primary',
              },
            }}
            displayEmpty
            renderValue={(value) => {
              if (!value) return <span>Select Native Language</span>;
              return <span>{value === 'en' ? 'English' : 'Spanish'}</span>;
            }}
            disabled={isRunning}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
          </Select>
          <Select 
            value={desiredLanguage} 
            onChange={(e) => setDesiredLanguage(e.target.value)}
            sx={{ 
              width: '200px',
              bgcolor: 'white',
              '& .MuiSelect-select': {
                color: 'text.primary',
              },
            }}
            displayEmpty
            renderValue={(value) => {
              if (!value) return <span>Select Desired Language</span>;
              return <span>{value === 'en' ? 'English' : 'Spanish'}</span>;
            }}
            disabled={isRunning}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
          </Select>
        </Box>
        
        {responseText && (
          <Box 
            p={2}
            mb={3}
            bgcolor="white"
            borderRadius="10px"
            width="100%"
            sx={{ wordWrap: 'break-word' }}
          >
            <Typography sx={{ fontFamily: 'Times New Roman, serif' }}>
              {responseText}
            </Typography>
          </Box>
        )}

        {stream && isRunning && (
          <Box mb={3}>
            <MicVisualizer stream={stream} />
          </Box>
        )}

        <IconButton 
          sx={{ 
            bgcolor: isRunning ? 'error.main' : (isLanguageSelectionComplete ? 'primary.main' : 'grey.300'),
            color: 'white',
            width: 60,
            height: 60,
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: isRunning ? 'error.dark' : (isLanguageSelectionComplete ? 'primary.dark' : 'grey.400'),
            },
          }}
          onClick={isRunning ? stopConversation : startConversation}
          disabled={!isLanguageSelectionComplete}
        >
          {isRunning ? <StopIcon /> : <MicIcon />}
        </IconButton>

        {isRunning && (
          <Typography sx={{ mt: 2, color: 'text.primary' }}>
            Session active. Click to stop.
          </Typography>
        )}
      </Box>
    </Box>
  );
} 