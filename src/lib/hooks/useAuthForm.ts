import { useState, useCallback } from 'react';
import { ZodError } from 'zod';
import { signInSchema, SignInFormData, SignInFormErrors } from '../validation/authSchemas';

interface UseAuthFormOptions {
  onSubmit: (values: SignInFormData) => Promise<void>;
}

interface AuthFormState {
  values: SignInFormData;
  errors: SignInFormErrors;
  isSubmitting: boolean;
  touched: Partial<Record<keyof SignInFormData, boolean>>;
  hasAttemptedSubmit: boolean;
}

export function useAuthForm({ onSubmit }: UseAuthFormOptions) {
  const [state, setState] = useState<AuthFormState>({
    values: {
      email: '',
      password: '',
    },
    errors: {},
    isSubmitting: false,
    touched: {},
    hasAttemptedSubmit: false,
  });

  const validateField = useCallback((name: keyof SignInFormData, value: string) => {
    if (!state.hasAttemptedSubmit && !state.touched[name]) {
      return '';
    }

    try {
      signInSchema.parse({ ...state.values, [name]: value });
      return '';
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === name);
        return fieldError?.message || '';
      }
      return '';
    }
  }, [state.values, state.hasAttemptedSubmit, state.touched]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof SignInFormData, value);
    
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: error },
      touched: { ...prev.touched, [name]: true },
    }));
  }, [validateField]);

  const handleBlur = useCallback((name: keyof SignInFormData) => {
    if (state.hasAttemptedSubmit) {
      const error = validateField(name, state.values[name]);
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: error },
        touched: { ...prev.touched, [name]: true },
      }));
    }
  }, [validateField, state.values, state.hasAttemptedSubmit]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ 
      ...prev, 
      isSubmitting: true,
      hasAttemptedSubmit: true,
    }));

    try {
      const validatedData = signInSchema.parse(state.values);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: SignInFormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof SignInFormData;
          errors[field] = err.message;
        });
        setState((prev) => ({ ...prev, errors }));
      }
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [state.values, onSubmit]);

  const reset = useCallback(() => {
    setState({
      values: {
        email: '',
        password: '',
      },
      errors: {},
      isSubmitting: false,
      touched: {},
      hasAttemptedSubmit: false,
    });
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
} 