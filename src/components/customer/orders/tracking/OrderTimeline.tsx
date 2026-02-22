'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
    events: Array<{
        id: string;
        title: string;
        description: string;
        createdAt: string;
        type: string;
    }>;
}

export function OrderTimeline({ events }: OrderTimelineProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!events.length) return null;

    return (
        <section className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors"
            >
                <span className="text-xs font-bold text-zinc-900 tracking-wider">Order Updates</span>
                {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {isExpanded && (
                <div className="px-5 pb-5 pt-2">
                    <div className="space-y-6 relative ml-2">
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-100" />
                        {events.map((event, i) => (
                            <div key={event.id} className="relative pl-6">
                                <div className={cn(
                                    "absolute left-[-4px] top-1.5 size-2 rounded-full border-2 border-white",
                                    i === 0 ? "bg-zinc-900" : "bg-zinc-200"
                                )} />
                                <div>
                                    <h4 className={cn("text-xs", i === 0 ? "font-bold text-zinc-900" : "font-medium text-zinc-500")}>
                                        {event.title}
                                    </h4>
                                    {event.description && <p className="text-xs text-zinc-400 mt-0.5">{event.description}</p>}
                                    <span className="text-[11px] font-medium text-zinc-300 tabular-nums mt-1 block">
                                        {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
