'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';

interface ActionBannerProps {
    personalizedItemsCount: number;
    deadline?: string;
}

export function ActionBanner({ personalizedItemsCount, deadline }: ActionBannerProps) {
    if (personalizedItemsCount === 0) return null;

    return (
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-4 mb-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-amber-500" />
                <h3 className="text-xs font-black text-amber-900 tracking-wider">Input Needed</h3>
            </div>
            <p className="text-[11px] text-amber-700 font-medium">
                You have {personalizedItemsCount} item{personalizedItemsCount > 1 ? 's' : ''} that require design details. Please scroll to the items below to submit.
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
