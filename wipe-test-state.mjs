import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const admin = createClient(url, serviceKey);

  const orderId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  const { data, error } = await admin
    .from('order_items')
    .update({ 
      personalization_details: null,
      status: 'pending'
    })
    .eq('order_id', orderId);

  if (error) {
    console.error('Failed to wipe state:', error);
  } else {
    console.log('Successfully wiped state for test order:', orderId);
  }
}
run();
