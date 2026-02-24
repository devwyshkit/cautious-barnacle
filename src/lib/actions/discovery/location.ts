'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies, headers } from 'next/headers'
import { GoogleMapsService } from '@/lib/services/google-maps'
import { cache } from 'react'
import { logger } from '@/lib/logging/logger'; // Added for standardized logging

export interface LocationData {
    name: string;
    address: string;
    pincode: string;
    /** Lat/lng when available (from headers or cookies) - enables location-driven discovery */
    lat?: number;
    lng?: number;
}

/**
 * WYSHKIT 2026: Server-side Location Resolver
 * 
 * Swiggy 2026 Pattern: One-Trip Location
 * - Resolves location once on the server to prevent hydration flickers.
 * - Authenticated users: Fetches default address from Supabase.
 * - Guest users: Checks cookies for ephemeral location.
 */
export const getServerLocation = cache(async function getServerLocation(): Promise<LocationData> {
    try {
        // 1. Check Edge-Injected Headers (Fastest Path - Swiggy 2026)
        const headerList = await headers()
        const edgeLat = headerList.get('x-wyshkit-location-lat')
        const edgeLng = headerList.get('x-wyshkit-location-lng')
        const edgeName = headerList.get('x-wyshkit-location-name')

        if (edgeLat && edgeLng) {
            return {
                name: edgeName ? decodeURIComponent(edgeName) : 'Current location',
                address: `${edgeLat}, ${edgeLng}`,
                pincode: '',
                lat: parseFloat(edgeLat),
                lng: parseFloat(edgeLng)
            }
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // 2. Fetch from Supabase for authenticated users (Fallback 1)
        if (user) {
            const { data: addresses } = await supabase
                .from('user_addresses')
                .select('name, type, city, address_line1, pincode, is_default, latitude, longitude')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false })
                .limit(1);

            if (addresses?.length) {
                const addr = addresses[0];
                const lat = addr.latitude !== null ? Number(addr.latitude) : undefined;
                const lng = addr.longitude !== null ? Number(addr.longitude) : undefined;
                return {
                    name: addr.name || addr.type || 'Saved address',
                    address: addr.city || addr.address_line1 || '',
                    pincode: addr.pincode || '',
                    ...(lat !== undefined && lng !== undefined && { lat, lng })
                };
            }
        }

        // 3. Fetch from Cookies for guest users (Fallback 2)
        const cookieStore = await cookies()
        const lat = cookieStore.get('wyshkit_lat')?.value
        const lng = cookieStore.get('wyshkit_lng')?.value
        const name = cookieStore.get('wyshkit_location_name')?.value

        if (lat && lng) {
            return {
                name: name || 'Current location',
                address: `${lat}, ${lng}`,
                pincode: '',
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            }
        }

        // 4. Fallback default
        // WYSHKIT 2026: Dev Experience - Default to Bangalore if no location set
        if (process.env.NODE_ENV === 'development') {
            return {
                name: 'Bangalore (Dev)',
                address: 'Koramangala, Bangalore',
                pincode: '560034',
                lat: 12.9716,
                lng: 77.5946
            }
        }

        return { name: 'Select location', address: '', pincode: '' }
    } catch (error) {
        return { name: 'Select location', address: '', pincode: '' }
    }
});

/** Set location cookies for guest/session (used by getServerLocation) */
export async function setLocationCookies(lat: number, lng: number, name: string) {
    const cookieStore = await cookies();
    cookieStore.set('wyshkit_lat', lat.toString(), { path: '/', maxAge: 60 * 60 * 24 * 30 });
    cookieStore.set('wyshkit_lng', lng.toString(), { path: '/', maxAge: 60 * 60 * 24 * 30 });
    cookieStore.set('wyshkit_location_name', name, { path: '/', maxAge: 60 * 60 * 24 * 30 });

    // WYSHKIT 2026: Database Persistence (Zero Split Brain)
    try {
        const { executeCommerceIntent } = await import('../commerce/intent-engine');
        await executeCommerceIntent({
            intent: 'SET_GUEST_LOCATION',
            payload: {
                lat,
                lng,
                name
            }
        });
    } catch (e) {
        // Fallback to cookie-only if checkout module isn't ready or other error
        logger.error('Failed to update checkout session with location:', { error: String(e) });
    }
}

/** Get address components from coordinates (for pre-filling address form) */
export async function getAddressFromCoords(lat: number, lng: number): Promise<{ city?: string; state?: string; pincode?: string; formattedAddress?: string; error?: string }> {
    try {
        const result = await GoogleMapsService.reverseGeocode(lat, lng);
        if (!result) return { error: 'Could not resolve location' };
        return {
            city: result.city,
            state: result.state,
            pincode: result.pincode,
            formattedAddress: result.formattedAddress,
        };
    } catch (e) {
        return { error: 'Failed to resolve location' };
    }
}

/** Set location from coordinates: geocode lat/lng to city/pincode, set cookies, return location name */
export async function setLocationFromCoords(lat: number, lng: number): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
        const result = await GoogleMapsService.reverseGeocode(lat, lng);
        if (!result) return { success: false, error: 'Could not resolve location' };
        const name = result.city ? `${result.city}${result.pincode ? ` ${result.pincode}` : ''}` : result.formattedAddress || 'Current location';
        await setLocationCookies(lat, lng, name);
        return { success: true, name };
    } catch (e) {
        return { success: false, error: 'Failed to set location' };
    }
}
/** Search for places using Google Places API */
export async function searchPlaces(query: string) {
    return await GoogleMapsService.searchPlaces(query);
}

/** Set location from a Google Place ID */
export async function setLocationFromPlaceId(placeId: string): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
        const details = await GoogleMapsService.getPlaceDetails(placeId);
        if (!details || !details.geometry?.location) return { success: false, error: 'Could not get place details' };

        const { lat, lng } = details.geometry.location;
        const name = details.name || details.formatted_address || 'Selected location';

        await setLocationCookies(lat, lng, name);
        return { success: true, name };
    } catch (e) {
        return { success: false, error: 'Failed to set location' };
    }
}
