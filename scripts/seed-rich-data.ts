import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config({ path: '.env.local' })

// WYSHKIT 2026: Allow seed in development, block in production
if (process.env.NODE_ENV === 'production') {
    console.error('Seed script cannot run in production. Use development environment.')
    process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearDatabase() {
    console.log('🧹 Clearing existing data...')
    // Delete in order of dependency to avoid foreign key constraints
    await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('draft_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('✨ Data cleared.')
}

async function seed() {
    console.log('🚀 Starting Rich Data Injection (Wyshkit 2026)...')

    await clearDatabase();

    // 1. Unified Categories (Occasions + Product Types)
    const categories = [
        {
            id: randomUUID(),
            name: 'Cakes',
            slug: 'cakes',
            is_active: true,
            display_order: 1,
            image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Flowers',
            slug: 'flowers',
            is_active: true,
            display_order: 2,
            image_url: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Birthdays',
            slug: 'birthdays', // Occasion as Category
            is_active: true,
            display_order: 3,
            image_url: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Anniversary',
            slug: 'anniversary', // Occasion as Category
            is_active: true,
            display_order: 4,
            image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Chocolates',
            slug: 'chocolates',
            is_active: true,
            display_order: 5,
            image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Hampers',
            slug: 'hampers',
            is_active: true,
            display_order: 6,
            image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Personalized',
            slug: 'personalized',
            is_active: true,
            display_order: 7,
            image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: randomUUID(),
            name: 'Plants',
            slug: 'plants',
            is_active: true,
            display_order: 8,
            image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400'
        }
    ]

    console.log('Injecting categories...')
    const { error: catError } = await supabase.from('categories').upsert(categories)
    if (catError) console.error('Error seeding categories:', catError)

    // 2. Partners (Premium Brands)
    const partnerIds = {
        smoor: randomUUID(),
        magnolia: randomUUID(),
        fnp: randomUUID(),
        interflora: randomUUID(),
        theobroma: randomUUID()
    };

    const partners = [
        {
            id: partnerIds.smoor,
            name: 'Smoor',
            display_name: 'Smoor Chocolates',
            description: 'Luxury couverture chocolates and signature bakes. Experience true indulgence.',
            city: 'Bangalore',
            rating: 4.8,
            is_active: true,
            is_online: true,
            image_url: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&q=80&w=800',
            base_delivery_charge: 40,
            status: 'active',
            latitude: 12.9716, // Bangalore Central
            longitude: 77.5946,
            slug: 'smoor-chocolates-bangalore'
        },
        {
            id: partnerIds.magnolia,
            name: 'Magnolia Bakery',
            display_name: 'Magnolia Bakery',
            description: 'World-famous banana pudding and classic American desserts.',
            city: 'Bangalore',
            rating: 4.9,
            is_active: true,
            is_online: true,
            image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
            base_delivery_charge: 60,
            status: 'active',
            latitude: 12.9784,
            longitude: 77.6408, // Indiranagar
            slug: 'magnolia-bakery-indiranagar'
        },
        {
            id: partnerIds.fnp,
            name: 'Ferns N Petals',
            display_name: 'FNP Elite',
            description: 'Premium floral arrangements and same-day gifting.',
            city: 'Bangalore',
            rating: 4.5,
            is_active: true,
            is_online: true,
            image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800',
            base_delivery_charge: 30,
            status: 'active',
            latitude: 12.9352,
            longitude: 77.6245, // Koramangala
            slug: 'fnp-elite-koramangala'
        },
        {
            id: partnerIds.interflora,
            name: 'Interflora',
            display_name: 'Interflora',
            description: 'The world’s most trusted luxury floral delivery network.',
            city: 'Bangalore',
            rating: 4.7,
            is_active: true,
            is_online: true,
            image_url: 'https://images.unsplash.com/photo-1596073419667-9d77d59f033f?auto=format&fit=crop&q=80&w=800',
            base_delivery_charge: 100,
            status: 'active',
            latitude: 12.9279,
            longitude: 77.6271,
            slug: 'interflora-bangalore'
        }
    ]

    console.log('Injecting partners...')
    const { error: partError } = await supabase.from('partners').upsert(partners)
    if (partError) console.error('Error seeding partners:', partError)

    // 3. Items (Rich Catalog)
    const items = [
        // SMOOR
        {
            id: randomUUID(),
            partner_id: partnerIds.smoor,
            name: 'Royal Chocolate Box (12pc)',
            description: 'Assorted handcrafted pralines in a luxury gift box.',
            base_price: 850,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            stock_quantity: 100,
            category: 'Chocolates',
            has_personalization: false,
            images: ['https://images.unsplash.com/photo-1549007994-cb92ca714503?auto=format&fit=crop&q=80&w=800'],
            slug: 'royal-chocolate-box-12pc'
        },
        {
            id: randomUUID(),
            partner_id: partnerIds.smoor,
            name: 'Intense 70% Dark Chocolate Cake',
            description: 'Rich, dense, and glossy. The ultimate dark chocolate indulgence.',
            base_price: 1400,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            stock_quantity: 100,
            category: 'Cakes',
            has_personalization: true,
            personalization_options: [
                { id: 'msg', name: 'Message on Cake', type: 'text', maxLength: 25, required: true },
                { id: 'flavor', name: 'Base Flavor', type: 'select', options: ['Classic Dark', 'Hazelnut Dark', 'Orange Dark'], required: true },
                { id: 'dietary', name: 'Eggless', type: 'boolean' }
            ],
            images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'],
            slug: 'intense-70-dark-chocolate-cake'
        },

        // MAGNOLIA
        {
            id: randomUUID(),
            partner_id: partnerIds.magnolia,
            name: 'Classic Banana Pudding',
            description: 'Layers of vanilla wafers, fresh bananas and creamy vanilla pudding.',
            base_price: 450,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            stock_quantity: 100,
            category: 'Cakes',
            has_personalization: false,
            images: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800'],
            slug: 'classic-banana-pudding'
        },

        // FNP
        {
            id: randomUUID(),
            partner_id: partnerIds.fnp,
            name: '10 Red Roses Bouquet',
            description: 'Classic symbol of love. Premium long-stemmed roses in paper packaging.',
            base_price: 599,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            category: 'Flowers',
            has_personalization: true,
            personalization_options: [{ id: 'card', name: 'Gift Card Message', type: 'text', maxLength: 100 }],
            images: ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=800'],
            slug: '10-red-roses-bouquet'
        },
        // INTERFLORA
        {
            id: randomUUID(),
            partner_id: partnerIds.interflora,
            name: 'Luxury Orchid Arrangement',
            description: 'Exotic purple orchids arranged in a glass vase.',
            base_price: 2400,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            category: 'Flowers',
            has_personalization: true,
            personalization_options: [{ id: 'card', name: 'Luxury Note Card', type: 'text', maxLength: 150 }],
            images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800'],
            slug: 'luxury-orchid-arrangement'
        },

        // BIRTHDAY SPECIALS
        {
            id: randomUUID(),
            partner_id: partnerIds.smoor,
            name: 'Ultimate Birthday Hamper',
            description: 'Cake, chocolates, and balloons. Everything you need for a party.',
            base_price: 2999,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            category: 'Birthdays',
            has_personalization: true,
            personalization_options: [{ id: 'card', name: 'Birthday Wish', type: 'text', maxLength: 100 }],
            images: ['https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=800'],
            slug: 'ultimate-birthday-hamper'
        },

        // ANNIVERSARY SPECIALS
        {
            id: randomUUID(),
            partner_id: partnerIds.interflora,
            name: 'Classic Romance Combo',
            description: 'Red roses and truffle cake. The perfect anniversary gift.',
            base_price: 1800,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            category: 'Anniversary',
            has_personalization: true,
            personalization_options: [{ id: 'card', name: 'Love Note', type: 'text', maxLength: 150 }],
            images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'],
            slug: 'classic-romance-combo'
        },

        // PERSONALIZED
        {
            id: randomUUID(),
            partner_id: partnerIds.fnp,
            name: 'Personalized Photo Frame',
            description: 'Wooden frame with your custom memory.',
            base_price: 499,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            category: 'Personalized',
            has_personalization: true,
            personalization_options: [
                { id: 'photo', name: 'Upload Photo', type: 'image', required: true, instructions: 'High resolution JPG/PNG only' },
                { id: 'caption', name: 'Caption', type: 'text', maxLength: 50 },
                { id: 'frame_color', name: 'Frame Finish', type: 'select', options: ['Oak', 'Walnut', 'Minimalist Black'], required: true }
            ],
            images: ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800'],
            slug: 'personalized-photo-frame'
        },
        // NEW ELITE ITEM
        {
            id: randomUUID(),
            partner_id: partnerIds.magnolia,
            name: 'Signature Dessert Box (Custom)',
            description: 'Curate your own Magnolia dessert experience.',
            base_price: 1250,
            is_active: true,
            approval_status: 'approved',
            stock_status: 'in_stock',
            category: 'Hampers',
            has_personalization: true,
            personalization_options: [
                { id: 'item1', name: 'First Choice', type: 'select', options: ['Banana Pudding', 'Red Velvet Cupcake', 'Cheesecake Slice'], required: true },
                { id: 'item2', name: 'Second Choice', type: 'select', options: ['Banana Pudding', 'Red Velvet Cupcake', 'Cheesecake Slice'], required: true },
                { id: 'note', name: 'Occasion Note', type: 'text', maxLength: 100 }
            ],
            images: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800'],
            slug: 'signature-dessert-box-custom'
        }

    ]

    console.log('Injecting items...')
    const { data: insertedItems, error: itemError } = await supabase.from('items').upsert(items).select()
    if (itemError) console.error('Error seeding items:', itemError)

    // 4. Variants for selected items
    const variants = []
    if (insertedItems) {
        const cake = insertedItems.find(i => i.slug === 'intense-70-dark-chocolate-cake')
        if (cake) {
            variants.push(
                { item_id: cake.id, name: '500g', price: 0, stock_quantity: 50, is_active: true },
                { item_id: cake.id, name: '1kg', price: 800, stock_quantity: 30, is_active: true }
            )
        }
        const pudding = insertedItems.find(i => i.slug === 'classic-banana-pudding')
        if (pudding) {
            variants.push(
                { item_id: pudding.id, name: 'Small Jar', price: 0, stock_quantity: 100, is_active: true },
                { item_id: pudding.id, name: 'Large Bowl', price: 600, stock_quantity: 20, is_active: true }
            )
        }
    }

    if (variants.length > 0) {
        console.log('Injecting variants...')
        const { error: varError } = await supabase.from('variants').upsert(variants)
        if (varError) console.error('Error seeding variants:', varError)
    }

    console.log('✅ Rich Data Seeded Successfully!')
    console.log('Tables cleared and replenished with premium content.')
}

seed().catch(console.error)
