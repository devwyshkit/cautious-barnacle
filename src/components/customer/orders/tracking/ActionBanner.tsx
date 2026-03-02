'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';

interface ActionBannerProps {
    personalizedProductsCount: number;
    deadline?: string;
}

export function ActionBanner({ personalizedProductsCount, deadline }: ActionBannerProps) {
    if (personalizedProductsCount === 0) return null;

    return (
        <div className="bg-[var(--well-warning)] border border-[var(--warning)]/20 rounded-[var(--radius-md)] p-4 mb-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-[var(--warning)]" />
                <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-tight">Input Needed</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
                You have {personalizedProductsCount} product{personalizedProductsCount > 1 ? 's' : ''} that require design details. Please scroll to the products below to submit.
            </p>
            <div className="mt-3">
                <HyperlocalTimer deadline={deadline} />
            </div>
        </div>
    );
}

function DeadlineTimer({ deadline }: { deadline?: string }) {
    // WYSHKIT 2026: Zero Reinvention
    // Using the shared HyperlocalTimer component for unified visual urgency
    return <HyperlocalTimer deadline={deadline} />;
}
