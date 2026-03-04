'use client';

import React from 'react';
import { useUI } from '@/providers/UIProvider';
import { ProfileSurface } from './ProfileSurface';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';

export function ProfileSheet() {
    const { isProfileSheetOpen, closeProfileSheet } = useUI();

    return (
        <ResponsiveSurface
            open={isProfileSheetOpen}
            onOpenChange={closeProfileSheet}
            title="My Account"
            description="Manage your orders, addresses, and settings"
            className="md:max-w-lg"
        >
            <div className="h-[80vh]">
                <ProfileSurface />
            </div>
        </ResponsiveSurface>
    );
}
