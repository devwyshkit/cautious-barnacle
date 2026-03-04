/**
 * Error handling utilities
 * Standardizes error handling across actions and API routes
 * Wyshkit 2026: Zero data mismatch, proper type safety
 */

import { NextResponse } from 'next/server';
import { logger } from "@/lib/logging/logger";

const ERROR_MAP: Record<string, string> = {
  'LIABILITY_SHIFTED': 'This product is already in production and cannot be cancelled.',
  'PRODUCT_NOT_FOUND': 'We couldn\'t find that product. It might have been removed.',
  'ALREADY_CANCELLED': 'This product has already been cancelled.',
  'OUT_OF_STOCK': 'Sorry, this product is currently out of stock.',
  'VENDOR_MISMATCH': 'You already have products from another store. Clear your cart to switch.',
  'INSUFFICIENT_WALLET_BALANCE': 'You don\'t have enough WyshKit Money for this selection.',
  'VENDOR_OFFLINE': 'This store is currently closed and not accepting orders.',
  'INSUFFICIENT_STOCK': 'One or more items in your cart just went out of stock.',
  'INVALID_ADDRESS': 'Please select a valid delivery address to proceed.',
  'UNAUTHORIZED': 'Please log in again to complete your order.',
};

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as any).code);
    if (ERROR_MAP[code]) return ERROR_MAP[code];
  }

  if (error instanceof Error) {
    const message = error.message;
    // Check if the message ITSELF is a code
    if (ERROR_MAP[message]) return ERROR_MAP[message];
    return message;
  }
  if (typeof error === 'string') {
    if (ERROR_MAP[error]) return ERROR_MAP[error];
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as any).message);
    if (ERROR_MAP[message]) return ERROR_MAP[message];
    return message;
  }
  return 'An unexpected error occurred';
}

/**
 * Handle errors in server actions
 * Returns consistent error format
 * Wyshkit 2026: Clear error messages for debugging
 */
export function handleActionError(error: unknown): { error: string } {
  const message = getErrorMessage(error);

  // Wyshkit 2026: Authority moved to central logger
  if (error instanceof Error && error.stack) {
    logger.error('Action Error', error);
  }

  return { error: message };
}

/**
 * Handle errors in API routes
 * Returns NextResponse with consistent error format
 */
export function handleAPIError(error: unknown, statusCode: number = 500): NextResponse {
  const errorMessage = getErrorMessage(error);

  logger.error('API Error', error as Error);

  return NextResponse.json(
    { error: errorMessage },
    { status: statusCode }
  );
}

/**
 * Log error in development mode only
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '[Error]';
  logger.error(prefix, error as Error);
}
