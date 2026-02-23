'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logging/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  router?: ReturnType<typeof useRouter>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * WYSHKIT 2026: Error Boundary for Payment Processing
 * Catches errors during payment operations and provides recovery options
 */
export class PaymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('PaymentErrorBoundary caught an error', error, undefined, { componentStack: errorInfo.componentStack });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.router?.refresh();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <CreditCard className="size-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900">Payment Error</h3>
              <p className="text-xs text-red-700 mt-0.5">
                We couldn't process your payment. Please check your payment details and try again.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <p className="text-xs text-red-600 mt-1 font-mono">
                  {this.state.error.message}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <AlertCircle className="size-3 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function PaymentErrorBoundaryWithRouter(props: Omit<Props, 'router'>) {
  const router = useRouter();
  return <PaymentErrorBoundary {...props} router={router} />;
}
