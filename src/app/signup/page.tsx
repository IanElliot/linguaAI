'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to signin page on success
      router.push('/signin?registered=true');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeading action="Create your" />
      
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 4,
          color: 'text.secondary',
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        Start your language learning journey today.
      </Typography>

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
          id="fullName"
          label="Full Name"
          name="fullName"
          autoComplete="name"
          autoFocus
          value={formData.fullName}
          onChange={handleChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          disabled={isSubmitting}
        />
        <FormTextField
          required
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          disabled={isSubmitting}
        />
        <FormTextField
          required
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
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
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Box>

      <SocialLogin text="or sign up with" />

      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ 
          mb: 3,
        }}
      >
        Already have an account?{' '}
        <Link
          component="button"
          onClick={() => router.push('/signin')}
          sx={{ 
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Sign in
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