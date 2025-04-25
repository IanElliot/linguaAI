'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Box,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import FormTextField from '../components/FormTextField';
import AuthLayout from '../components/AuthLayout';
import SocialLogin from '../components/SocialLogin';
import AuthHeading from '../components/AuthHeading';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setApiError(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      console.log('Attempting sign in...');
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        setApiError(result.error);
      } else if (result?.ok) {
        console.log('Sign in successful, redirecting...');
        // Force a full page refresh and redirect
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setApiError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeading action="Log in to" />
      
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

      {searchParams.get('registered') && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Account created successfully! Please sign in.
        </Alert>
      )}

      {searchParams.get('error') && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
        >
          {searchParams.get('error')}
        </Alert>
      )}

      {apiError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setApiError(null)}
        >
          {apiError}
        </Alert>
      )}

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
        <FormTextField
          required
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={isSubmitting}
        />
        <FormTextField
          required
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{ 
            mt: 1,
            py: 1.5,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: '#e67e00',
              transform: 'scale(1.02)',
            },
          }}
        >
          {isSubmitting ? 'Signing in...' : 'Continue'}
        </Button>
      </Box>

      <SocialLogin text="or log in with" />

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
            color: 'primary.main',
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
    </AuthLayout>
  );
} 