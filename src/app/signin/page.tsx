'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
import { useAuthForm } from '../../lib/hooks/useAuthForm';
import { SignInFormData } from '../../lib/validation/authSchemas';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  } = useAuthForm({
    onSubmit: async (values: SignInFormData) => {
      try {
        console.log('Attempting sign in...');
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        console.log('Sign in result:', result);

        if (result?.error) {
          setApiError(result.error);
          return;
        }

        if (result?.ok) {
          console.log('Sign in successful, redirecting...');
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Sign in error:', error);
        setApiError('An unexpected error occurred');
      }
    },
  });

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    reset();
    router.push('/signup');
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
          gap: 3,
        }}
      >
        <FormTextField
          name="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          error={!!errors.email}
          helperText={errors.email}
          required
          fullWidth
        />

        <FormTextField
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          error={!!errors.password}
          helperText={errors.password}
          required
          fullWidth
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            mb: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        <SocialLogin text="or log in with" />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              href="#"
              onClick={handleSignUpClick}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
} 