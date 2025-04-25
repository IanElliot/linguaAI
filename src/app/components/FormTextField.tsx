'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

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

export default function FormTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth
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
        ...props.InputLabelProps,
      }}
    />
  );
} 