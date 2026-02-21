import { NextRequest, NextResponse } from 'next/server';
import { GoogleMapsService } from '@/lib/services/google-maps';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
    }

    const result = await GoogleMapsService.reverseGeocode(parseFloat(lat), parseFloat(lng));
    return NextResponse.json(result);
}
