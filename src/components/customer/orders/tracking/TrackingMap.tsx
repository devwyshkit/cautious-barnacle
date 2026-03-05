'use client';

import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { logger } from '@/lib/logging/logger';
import { OrderDetail } from '@/lib/types/order';

interface TrackingMapProps {
    order: OrderDetail;
    className?: string;
}

/**
 * WYSHKIT 2026: The "Live Pulse" Live Tracking Map
 * 
 * - Shows Vendor, Customer, and Rider markers.
 * - Dynamic bounds to fit all active markers.
 * - Realtime updates via props.
 */
export function TrackingMap({ order, className }: TrackingMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [api, setApi] = useState<any>(null); // Stores Marker, LatLngBounds, Size, etc.
    const markersRef = useRef<Record<string, any>>({});
    const directionsRendererRef = useRef<any>(null);
    const routeFetchedRef = useRef(false);

    // Initialize Google Maps
    useEffect(() => {
        if (!mapRef.current || api) return;

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            logger.warn('Google Maps API key is missing. Skipping map load to prevent console errors.');
            return;
        }

        setOptions({
            key: apiKey,
            v: 'weekly',
        });

        async function initMap() {
            try {
                // Modern functional API
                const [
                    { Map },
                    { Marker },
                    { LatLngBounds, Size },
                    { DirectionsService, DirectionsRenderer }
                ] = await Promise.all([
                    importLibrary('maps'),
                    importLibrary('marker'),
                    importLibrary('core'),
                    importLibrary('routes')
                ]);

                setApi({ Marker, LatLngBounds, Size, DirectionsService });

                const newMap = new Map(mapRef.current as HTMLElement, {
                    center: { lat: 12.9716, lng: 77.5946 }, // Default Bangalore
                    zoom: 13,
                    disableDefaultUI: true,
                    mapId: 'WYSHKIT_TRACKING_MAP',
                    styles: [
                        {
                            featureType: 'poi',
                            elementType: 'labels',
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                });

                directionsRendererRef.current = new DirectionsRenderer({
                    map: newMap,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#000000',
                        strokeWeight: 4,
                        strokeOpacity: 0.8
                    }
                });

                setMap(newMap);
            } catch (err) {
                logger.error('Failed to load Google Maps', err);
            }
        }

        initMap();
    }, [api]);

    // Update Markers
    useEffect(() => {
        if (!map || !api) return;

        const { Marker, LatLngBounds, Size } = api;
        const locations: Record<string, { lat: number, lng: number, label: string, icon: string }> = {};

        // 1. Vendor Location
        if (order.vendor_lat && order.vendor_lng) {
            locations.vendor = {
                lat: order.vendor_lat,
                lng: order.vendor_lng,
                label: 'Vendor',
                icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
            };
        }

        // 2. Customer Location (from delivery_address)
        const addr = order.delivery_address as any;
        if (addr?.lat && (addr?.lng || addr?.lon)) {
            locations.customer = {
                lat: Number(addr.lat),
                lng: Number(addr.lng || addr.lon),
                label: 'You',
                icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            };
        }

        // 3. Rider Location (if out for delivery)
        if (order.rider_lat && order.rider_lng) {
            locations.rider = {
                lat: order.rider_lat,
                lng: order.rider_lng,
                label: 'Rider',
                icon: 'https://maps.google.com/mapfiles/ms/icons/motorcycling.png'
            };
        }

        // Sync Markers
        const bounds = new LatLngBounds();
        let hasPoints = false;

        Object.entries(locations).forEach(([key, loc]) => {
            const position = { lat: loc.lat, lng: loc.lng };
            bounds.extend(position);
            hasPoints = true;

            if (markersRef.current[key]) {
                markersRef.current[key].setPosition(position);
            } else {
                markersRef.current[key] = new Marker({
                    position,
                    map,
                    title: loc.label,
                    icon: {
                        url: loc.icon,
                        scaledSize: new Size(32, 32)
                    }
                });
            }
        });

        // Auto-fit bounds
        if (hasPoints && !routeFetchedRef.current) {
            map.fitBounds(bounds);
            // Don't zoom in too much for single point
            setTimeout(() => {
                if (map.getZoom() > 17) map.setZoom(15);
            }, 100);
        }

        // Fetch route if not fetched and we have both vendor and customer
        if (locations.vendor && locations.customer && !routeFetchedRef.current) {
            const directionsService = new api.DirectionsService();
            directionsService.route({
                origin: { lat: locations.vendor.lat, lng: locations.vendor.lng },
                destination: { lat: locations.customer.lat, lng: locations.customer.lng },
                travelMode: 'DRIVING'
            }, (response: any, status: string) => {
                if (status === 'OK' && directionsRendererRef.current) {
                    directionsRendererRef.current.setDirections(response);
                    routeFetchedRef.current = true;
                } else {
                    logger.warn('Directions request failed due to ' + status);
                }
            });
        }

    }, [map, api, order.vendor_lat, order.vendor_lng, order.delivery_address, order.rider_lat, order.rider_lng]);

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className={cn(
                    "w-full h-[220px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)] overflow-hidden transition-all duration-700 shadow-inner",
                    className
                )}
            />
            <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--surface)]/90 backdrop-blur-sm border border-[var(--border)] rounded-[var(--radius-sm)] shadow-sm flex items-center gap-1.5 pointer-events-none">
                <div className="size-1.5 bg-[var(--success)] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[var(--text-primary)] tracking-tight uppercase">Live Pulse</span>
            </div>
        </div>
    );
}

// Simple cn helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
