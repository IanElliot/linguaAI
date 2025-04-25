'use client';

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-manrope)',
    h4: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 400,
    },
  },
  palette: {
    background: {
      default: '#f5f5dc',
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 