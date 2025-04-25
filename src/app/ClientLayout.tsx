'use client';

import React from 'react';
import { Box } from '@mui/material';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box 
      component="main" 
      sx={{ 
        backgroundColor: '#f5f5dc',
        minHeight: '100vh',
        width: '100vw'
      }}
    >
      {children}
    </Box>
  );
} 