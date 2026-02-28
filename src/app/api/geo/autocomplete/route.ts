import { NextRequest, NextResponse } from 'next/server';
import { GoogleMapsService } from '@/lib/services/google-maps';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const results = await GoogleMapsService.searchPlaces(query);
    return NextResponse.json(results);
}
