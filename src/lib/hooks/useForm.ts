import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  touched: Partial<Record<keyof T, boolean>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
    touched: {},
  });

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      try {
        validationSchema.parse({ ...state.values, [name]: value });
        return '';
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldError = error.errors.find((err) => err.path[0] === name);
          return fieldError?.message || '';
        }
        return '';
      }
    },
    [state.values, validationSchema]
  );

  const handleChange = useCallback(
    (name: string, value: string) => {
      const error = validateField(name as keyof T, value);
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        errors: { ...prev.errors, [name]: error },
        touched: { ...prev.touched, [name]: true },
      }));
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (name: string) => {
      const error = validateField(name as keyof T, state.values[name as keyof T]);
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: error },
        touched: { ...prev.touched, [name]: true },
      }));
    },
    [validateField, state.values]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        const validatedData = validationSchema.parse(state.values);
        await onSubmit(validatedData);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors: Partial<Record<keyof T, string>> = {};
          error.errors.forEach((err) => {
            const field = err.path[0] as keyof T;
            errors[field] = err.message;
          });
          setState((prev) => ({ ...prev, errors }));
        }
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.values, validationSchema, onSubmit]
  );

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      isSubmitting: false,
      touched: {},
    });
  }, [initialValues]);

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