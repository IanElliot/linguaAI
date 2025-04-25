'use client';

import React from 'react';
import { Typography } from '@mui/material';

interface AuthHeadingProps {
  action: string;
}

export default function AuthHeading({ action }: AuthHeadingProps) {
  return (
    <Typography 
      component="h1" 
      variant="h4" 
      sx={{ 
        mb: 1.5,
        fontWeight: 700,
        textAlign: 'center',
        '& .brand': {
          fontFamily: 'var(--font-outfit)',
          color: 'primary.main',
          textShadow: '0 2px 4px rgba(247, 148, 29, 0.1)',
          fontWeight: 800,
        },
      }}
    >
      {action} <span className="brand">LinguaAI</span>
    </Typography>
  );
} 