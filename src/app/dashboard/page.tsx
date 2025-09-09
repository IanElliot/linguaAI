'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Select, MenuItem, IconButton, Typography, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import MicVisualizer from '@/lib/components/MicVisualizer';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import useWebRTCAudioSession from '@/hooks/useWebRTC';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { data: session } = useSession();
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [desiredLanguage, setDesiredLanguage] = useState('');
  const [responseText, setResponseText] = useState('');
  const audioEl = useRef<HTMLAudioElement>(null);

  const {
    status,
    isSessionActive,
    handleStartStopClick,
    audioStreamRef,
    currentVolume,
    conversation,
    sendTextMessage
  } = useWebRTCAudioSession()

  const isLanguageSelectionComplete = nativeLanguage && desiredLanguage;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f9f6f1'
    }}>
      <Navbar />
      
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        sx={{ 
          minHeight: 'calc(100vh - 80px)',
          padding: '20px',
          gap: '20px'
        }}
      >
        {/* Language Selection */}
        <Box display="flex" gap="20px" alignItems="center">
          <Select
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
            displayEmpty
            sx={{ minWidth: 150, backgroundColor: 'white' }}
          >
            <MenuItem value="">Native Language</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
            <MenuItem value="it">Italian</MenuItem>
            <MenuItem value="pt">Portuguese</MenuItem>
          </Select>

          <Select
            value={desiredLanguage}
            onChange={(e) => setDesiredLanguage(e.target.value)}
            displayEmpty
            sx={{ minWidth: 150, backgroundColor: 'white' }}
            
          >
            <MenuItem value="">Target Language</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
            <MenuItem value="it">Italian</MenuItem>
            <MenuItem value="pt">Portuguese</MenuItem>
          </Select>
        </Box>


        
        {responseText && (
          <Box 
            p={2}
            mb={3}
            bgcolor="white"
            borderRadius="10px"
            width="100%"
            maxWidth="600px"
            sx={{ wordWrap: 'break-word' }}
          >
            <Typography sx={{ fontFamily: 'Times New Roman, serif' }}>
              {responseText}
            </Typography>
          </Box>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Box 
            p={2}
            bgcolor="white"
            borderRadius="10px"
            width="100%"
            maxWidth="600px"
            sx={{ maxHeight: '200px', overflow: 'auto' }}
          >
            <Typography variant="h6" gutterBottom>Conversation</Typography>
            {conversation.map((msg, idx) => (
              <Box key={idx} mb={1}>
                <Typography variant="caption" color="text.secondary">
                  {msg.role} ({msg.status}):
                </Typography>
                <Typography>{msg.text || "..."}</Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box marginBottom="20px">
          <MicVisualizer 
            stream={audioStreamRef.current} 
            isSpeaking={isSessionActive && currentVolume > 0.1}
          />
        </Box>

        <IconButton 
          style={{
            backgroundColor: isSessionActive 
              ? 'red' 
              : 'green',
            color: 'white',
            width: '80px',
            height: '80px',
            fontSize: '2rem'
          }}
          onClick={handleStartStopClick}
          /* disabled={!isLanguageSelectionComplete} */
        >
          {isSessionActive ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
        </IconButton>



        <audio ref={audioEl} />
      </Box>
    </Box>
  );
} 