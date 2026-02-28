'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logging/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * WYSHKIT 2026: Error Boundary for Cart Operations
 * Catches errors during cart add/remove/update operations
 */
export class CartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('CartErrorBoundary caught an error', error, undefined, { componentStack: errorInfo.componentStack });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Refresh cart state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Cart Error</span>
          </div>
          <p className="text-xs text-amber-700">
            There was an issue updating your cart. Please refresh the page.
          </p>
          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <AlertCircle className="size-3 mr-2" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
