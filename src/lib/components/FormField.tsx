import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'onChange' | 'error' | 'onBlur'> {
  name: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
}

export function FormField({
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  ...props
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  const handleBlur = () => {
    onBlur?.(name);
  };

  return (
    <TextField
      {...props}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched && !!error}
      helperText={touched && error}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'primary.main',
        },
      }}
    />
  );
} 