import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function Header() {
  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '64px', // Slightly smaller than default
          justifyContent: 'center',
          px: { xs: 2, sm: 3 }, // Responsive padding
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: 'orange',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem' }, // Responsive font size
            }}
          >
            LinguaAI
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#666666',
              display: { xs: 'none', sm: 'block' }, // Hide on mobile
            }}
          >
            Your conversational language assistant
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 