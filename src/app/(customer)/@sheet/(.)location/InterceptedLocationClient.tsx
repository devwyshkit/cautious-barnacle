'use client';

import { LocationSheet } from "@/components/customer/LocationSheet";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { ModalHeader } from "@/components/ui/ModalHeader";
import React from "react";

export function InterceptedLocationClient() {
    const router = useRouter();
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
        router.back();
    };

    return (
        <Drawer
            open={open}
            onOpenChange={(v) => {
                if (!v) handleClose();
            }}
        >
            <DrawerContent
                className="h-auto max-h-[85dvh] rounded-t-[32px] border-x border-t border-zinc-100 overflow-hidden p-0 gap-0 flex flex-col bg-white"
            >
                <DrawerTitle className="sr-only">Delivery Location</DrawerTitle>
                <ModalHeader title="Delivery Location" isSheet={true} />
                <div className="flex-1 overflow-hidden relative min-h-0">
                    <LocationSheet isRouteContext={false} onSelect={() => router.back()} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
