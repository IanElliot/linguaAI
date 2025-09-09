'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Box, Paper, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f9f6f1',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      
      <Container 
        maxWidth="sm" 
        sx={{ 
          mt: 8,
          mb: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Profile
          </Typography>

          <Box
            sx={{
              width: '100%',
              p: 3,
              borderRadius: '8px',
              bgcolor: '#f9f6f1',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              User Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Name: {session?.user?.name || 'Not provided'}
            </Typography>
            <Typography variant="body1">
              Email: {session?.user?.email || 'Not provided'}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 