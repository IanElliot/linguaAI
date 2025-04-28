import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { apiResponseSchema } from '../validation/schemas';

export type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export function createSuccessResponse(data: any): NextResponse {
  const response: ApiResponse = {
    success: true,
    data,
  };
  return NextResponse.json(response);
}

export function createErrorResponse(error: string | Error | ZodError): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: error instanceof Error ? error.message : error,
  };
  return NextResponse.json(response, { status: 400 });
}

export function createServerErrorResponse(error: Error): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
  };
  console.error('Server error:', error);
  return NextResponse.json(response, { status: 500 });
}

export function validateResponse(data: unknown): ApiResponse {
  return apiResponseSchema.parse(data);
} 