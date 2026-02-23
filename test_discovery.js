const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.rpc('get_home_surface', {
    p_lat: 28.5,
    p_lng: 77.2
  });
  console.log("SQL Output keys:", Object.keys(data || {}));
  console.log("Sections from SQL:", JSON.stringify(data?.sections, null, 2));
}

run();
