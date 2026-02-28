import { logger } from '@/lib/logging/logger';

interface GeoResult {
    city?: string;
    state?: string;
    pincode?: string;
    formattedAddress?: string;
}

export const GoogleMapsService = {
    reverseGeocode: async (lat: number, lng: number): Promise<GeoResult | null> => {
        try {
            // WYSHKIT 2026: Security Hardening
            // Use private key (server-only). Falling back to NEXT_PUBLIC only for backward compatibility during migration.
            const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
            if (!apiKey) {
                logger.warn('Google Maps API key missing');
                // Fallback or mock for dev if needed
                return null;
            }

            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status !== 'OK' || !data.results?.[0]) {
                logger.error('Google Maps reverse geocode failed', data);
                return null;
            }

            const result = data.results[0];
            const components = result.address_components;

            let city = '';
            let state = '';
            let pincode = '';

            for (const comp of components) {
                if (comp.types.includes('locality')) city = comp.long_name;
                if (comp.types.includes('administrative_area_level_1')) state = comp.long_name;
                if (comp.types.includes('postal_code')) pincode = comp.long_name;
            }

            return {
                city,
                state,
                pincode,
                formattedAddress: result.formatted_address
            };
        } catch (error) {
            logger.error('GoogleMapsService error', error);
            return null;
        }
    },
    searchPlaces: async (query: string): Promise<any[]> => {
        try {
            const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
            if (!apiKey) return [];
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=country:in`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.status !== 'OK') return [];
            return data.predictions;
        } catch {
            return [];
        }
    },
    getPlaceDetails: async (placeId: string): Promise<any> => {
        try {
            const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
            if (!apiKey) return null;
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.status !== 'OK') return null;
            return data.result;
        } catch {
            return null;
        }
    }
};
