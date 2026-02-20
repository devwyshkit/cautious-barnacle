import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = createClient(url, serviceKey);
  const regular = createClient(url, anonKey);

  const { data: users } = await admin.auth.admin.listUsers();
  let targetUser = users.users.find(u => u.phone === '+917624845361' || u.phone === '7624845361');
  
  if (targetUser) {
    console.log('User found:', targetUser.phone, 'Confirmed At:', targetUser.phone_confirmed_at);
    // Force confirmation
    await admin.auth.admin.updateUserById(targetUser.id, {
      password: 'Wyshkit2026!',
      phone_confirm: true
    });
  }

  const { data, error } = await regular.auth.signInWithPassword({
    phone: '+917624845361',
    password: 'Wyshkit2026!',
  });
  console.log('Login result:', error ? error.message : 'SUCCESS');
}
run();
