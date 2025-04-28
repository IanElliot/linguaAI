import React from 'react';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';

interface SocialLoginProps {
  text: string;
}

export default function SocialLogin({ text }: SocialLoginProps) {
  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Divider sx={{ mb: 4 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            px: 2,
          }}
        >
          {text}
        </Typography>
      </Divider>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <IconButton 
          sx={{ 
            border: '1px solid #e0e0e0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { 
              borderColor: '#bdbdbd',
              transform: 'scale(1.1)',
            }
          }}
        >
          <GoogleIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            border: '1px solid #e0e0e0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { 
              borderColor: '#bdbdbd',
              transform: 'scale(1.1)',
            }
          }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            border: '1px solid #e0e0e0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { 
              borderColor: '#bdbdbd',
              transform: 'scale(1.1)',
            }
          }}
        >
          <AppleIcon />
        </IconButton>
      </Box>
    </Box>
  );
} 