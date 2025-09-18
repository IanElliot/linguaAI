'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9f6f1',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 2, 
            color: 'text.secondary',
            animation: `${pulseAnimation} 2s infinite`
          }}
        >
          Loading...
        </Typography>
      </Box>
    </Box>
  );
}
