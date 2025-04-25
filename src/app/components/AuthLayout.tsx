'use client';

import React from 'react';
import { Box, Container, Paper, keyframes } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const backgroundPattern = `data:image/svg+xml,${encodeURIComponent(`
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F7941D;stop-opacity:0.03" />
        <stop offset="100%" style="stop-color:#F7941D;stop-opacity:0.01" />
      </linearGradient>
    </defs>
    <path d="M0,50 Q25,25 50,50 T100,50" stroke="url(#gradient)" fill="none" stroke-width="1" />
    <path d="M0,30 Q25,5 50,30 T100,30" stroke="url(#gradient)" fill="none" stroke-width="1" />
    <path d="M0,70 Q25,45 50,70 T100,70" stroke="url(#gradient)" fill="none" stroke-width="1" />
  </svg>
`)}`;

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f9f6f1',
      backgroundImage: `url("${backgroundPattern}")`,
      backgroundSize: '100px 100px',
      backgroundRepeat: 'repeat',
    }}>
      <Container 
        component="main" 
        maxWidth="sm" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 4, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            animation: `${fadeIn} 0.6s ease-out`,
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
} 