'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logging/logger';
import { cn } from '@/lib/utils';

interface Props {
    children: ReactNode;
    surfaceName: string;
    fallback?: ReactNode;
    className?: string;
    showHomeButton?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * WYSHKIT 2026: Standardized Surface Error Boundary
 * Generic recovery path for major application surfaces.
 */
export class SurfaceErrorBoundary extends Component<Props & { router?: any }, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error(`[SurfaceErrorBoundary:${this.props.surfaceName}] caught error`, error, undefined, {
            componentStack: errorInfo.componentStack
        });
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
                <div className={cn("min-h-[400px] flex items-center justify-center p-8 text-center", this.props.className)}>
                    <div className="max-w-md w-full space-y-6">
                        <div className="size-20 rounded-xl bg-[var(--well-destructive)] flex items-center justify-center mx-auto border border-[var(--destructive)]/10 shadow-sm animate-in zoom-in duration-500">
                            <AlertCircle className="size-10 text-[var(--destructive)]" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Something went wrong</h2>
                            <p className="text-sm text-[var(--text-secondary)] font-medium px-4">
                                We encountered a glitch on this page. Our team has been notified.
                            </p>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mt-4 p-3 bg-[var(--surface-muted)] rounded-xl text-left border border-[var(--border)]">
                                    <p className="text-xs font-black tracking-tight text-[var(--text-tertiary)] mb-1">Developer Details</p>
                                    <p className="text-xs text-[var(--destructive)] font-mono break-all">{this.state.error.message}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                onClick={this.handleReset}
                                className="w-full h-14 rounded-xl font-black tracking-tight text-xs"
                            >
                                <RefreshCw className="size-4 mr-2" />
                                Retry {this.props.surfaceName}
                            </Button>

                            {this.props.showHomeButton && (
                                <Button
                                    onClick={() => window.location.href = '/'}
                                    variant="outline"
                                    className="w-full h-14 rounded-xl font-black tracking-tight text-xs border-[var(--border)]"
                                >
                                    <Home className="size-4 mr-2" />
                                    Back to Home
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export function SurfaceErrorBoundaryWithRouter(props: Props) {
    const router = useRouter();
    return <SurfaceErrorBoundary {...props} router={router} />;
}
