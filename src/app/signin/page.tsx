'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Container,
  Divider,
  IconButton,
  keyframes,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';

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

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #ffffff inset',
      WebkitTextFillColor: '#000000',
      transition: 'background-color 5000s ease-in-out 0s',
    },
    '& input:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 100px #ffffff inset',
      WebkitTextFillColor: '#000000',
    },
    '& input:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 100px #ffffff inset',
      WebkitTextFillColor: '#000000',
    },
  },
};

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

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // TODO: Add API call here
    }
  };

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
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 1.5,
              fontWeight: 700,
              textAlign: 'center',
              '& .brand': {
                fontFamily: 'var(--font-outfit)',
                color: '#F7941D',
                textShadow: '0 2px 4px rgba(247, 148, 29, 0.1)',
                fontWeight: 800,
              },
            }}
          >
            Log in to <span className="brand">LinguaAI</span>
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 4,
              color: 'text.secondary',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Start learning a new language the natural way — through conversation.
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: '#F7941D',
                  },
                },
              }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: '#F7941D',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 1,
                py: 1.5,
                borderRadius: '8px',
                bgcolor: '#F7941D',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: '#e67e00',
                  transform: 'scale(1.02)',
                },
              }}
            >
              Continue
            </Button>
          </Box>

          <Box sx={{ width: '100%', my: 4 }}>
            <Divider sx={{ mb: 4 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  px: 2,
                }}
              >
                or log in with
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

            <Button
              fullWidth
              variant="outlined"
              sx={{ 
                mb: 3,
                py: 1.5,
                borderRadius: '8px',
                borderColor: '#F7941D',
                color: '#F7941D',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#e67e00',
                  color: '#e67e00',
                  transform: 'scale(1.02)',
                  bgcolor: 'rgba(247, 148, 29, 0.04)',
                },
              }}
            >
              Continue with LinguaAI
            </Button>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
              mb: 3,
            }}
          >
            New to LinguaAI?{' '}
            <Link
              component="button"
              onClick={() => router.push('/signup')}
              sx={{ 
                color: '#F7941D',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign up now
            </Link>
          </Typography>

          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center"
            sx={{ 
              maxWidth: '80%',
            }}
          >
            By continuing, you agree to our{' '}
            <Link href="/terms" sx={{ color: 'inherit' }}>Terms and Conditions</Link>
            {' '}and{' '}
            <Link href="/privacy" sx={{ color: 'inherit' }}>Privacy Policy</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
} 