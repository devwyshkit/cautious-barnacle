import { executeCommerceIntent } from './src/lib/actions/commerce/intent-engine';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAddToCart() {
    console.log("Testing Add to Cart...");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Get a valid product
    const { data: products, error } = await supabase.from('products').select('*').limit(1);
    const product = products?.[0];

    if (!product) {
        console.error("No product found to test.");
        return;
    }

    console.log(`Adding Product: ${product.name} (${product.id})`);

    const result = await executeCommerceIntent({
        intent: 'ADD_TO_CART',
        payload: {
            product_id: product.id,
            quantity: 1,
            variant_id: null,
            personalization: { enabled: false, fields: {} },
            selected_addons: []
        }
    });

    console.log("Result:", JSON.stringify(result, null, 2));
}

testAddToCart().catch(console.error);
