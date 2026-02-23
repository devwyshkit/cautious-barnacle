import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('--- WyshKit Swiggy 2026 Enrichment ---');

    // 1. Categories
    console.log('Upserting categories...');
    await supabase.from('categories').upsert([
        { name: 'Mugs', slug: 'mugs', is_active: true, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80', display_order: 1 },
        { name: 'Photo Frames', slug: 'photo-frames', is_active: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', display_order: 2 },
        { name: 'Cushions', slug: 'cushions', is_active: true, image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', display_order: 3 },
        { name: 'Cakes', slug: 'cakes', is_active: true, image_url: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80', display_order: 4 },
        { name: 'Keychains', slug: 'keychains', is_active: true, image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80', display_order: 5 }
    ], { onConflict: 'slug' });

    // 2. Partners
    console.log('Upserting partners...');
    await supabase.from('partners').upsert([
        {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Signature Gifts Koramangala',
            slug: 'signature-gifts-koramangala',
            city: 'Bengaluru',
            is_active: true,
            rating: 4.8,
            prep_hours: 1,
            delivery_fee: 40,
            latitude: 12.935,
            longitude: 77.614,
            description: 'Premium personalized gifts delivered in minutes.',
            image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80'
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Bake & Bloom',
            slug: 'bake-and-bloom',
            city: 'Bengaluru',
            is_active: true,
            rating: 4.5,
            prep_hours: 1,
            delivery_fee: 40,
            latitude: 12.938,
            longitude: 77.622,
            description: 'Custom cakes and floral arrangements for every occasion.',
            image_url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80'
        }
    ], { onConflict: 'id' });

    // 3. Items
    console.log('Upserting items...');
    await supabase.from('items').upsert([
        {
            id: '11111111-1111-1111-1111-111111111111',
            partner_id: '00000000-0000-0000-0000-000000000001',
            name: 'Magic Personalized Mug',
            slug: 'magic-personalized-mug',
            description: 'Heat-sensitive mug that reveals your photo.',
            base_price: 399,
            category: 'mugs',
            is_active: true,
            images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
            has_personalization: true,
            approval_status: 'approved'
        },
        {
            id: '11111111-1111-1111-1111-111111111112',
            partner_id: '00000000-0000-0000-0000-000000000001',
            name: 'Wooden Photo Frame',
            slug: 'wooden-photo-frame',
            description: 'Classic oak frame with custom engraving.',
            base_price: 599,
            category: 'photo-frames',
            is_active: true,
            images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
            has_personalization: true,
            approval_status: 'approved'
        },
        {
            id: '11111111-1111-1111-1111-111111111113',
            partner_id: '00000000-0000-0000-0000-000000000002',
            name: 'Chocolate Truffle Cake',
            slug: 'chocolate-truffle-cake',
            description: '1kg moist chocolate truffle cake.',
            base_price: 899,
            category: 'cakes',
            is_active: true,
            images: ['https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80'],
            has_personalization: false,
            approval_status: 'approved'
        }
    ], { onConflict: 'id' });

    // 4. Platform Settings
    console.log('Upserting platform settings...');
    await supabase.from('platform_settings').upsert([
        { key: 'platform_fee', value: [10] },
        { key: 'personalization_unit_fee', value: [50] },
        { key: 'delivery_slabs', value: [{ max_km: 3, fee: 40 }, { max_km: 7, fee: 60 }, { max_km: null, fee: 80 }] },
        {
            key: 'home_layout', value: [
                { id: 'categories_rail', type: 'CIRCLE_RAIL', title: 'What on your mind?', source: 'categories' },
                { id: 'trending_scroll', type: 'CARD_RAIL', title: 'Trending Around You', source: 'trendingItems' },
                { id: 'featured_stores', type: 'GRID', title: 'Top Stores Near You', source: 'featuredPartners' }
            ]
        }
    ], { onConflict: 'key' });

    console.log('--- Enrichment Complete ---');
}

seed().catch(console.error);
