import { NextRequest, NextResponse } from 'next/server';
import { GoogleMapsService } from '@/lib/services/google-maps';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
        return NextResponse.json({ error: 'Missing placeId' }, { status: 400 });
    }

    const result = await GoogleMapsService.getPlaceDetails(placeId);
    return NextResponse.json(result);
}
