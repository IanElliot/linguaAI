import { z } from 'zod';

// Common validation rules
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Form schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignInFormErrors = Partial<Record<keyof SignInFormData, string>>;

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SignInResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
} 