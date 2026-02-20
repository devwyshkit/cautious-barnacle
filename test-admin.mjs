import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !serviceKey || !anonKey) {
        console.error('Missing env vars');
        return;
    }

    const admin = createClient(url, serviceKey);
    const regular = createClient(url, anonKey);

    console.log('Admin client created. Listing users...');
    const { data: users, error: listError } = await admin.auth.admin.listUsers();
    if (listError) {
        console.error('List users error:', listError);
        return;
    }

    const normalizedPhone = '+917624845361';
    let targetUser = users?.users.find(u => u.phone === '7624845361' || u.phone === normalizedPhone);

    if (!targetUser) {
        console.log('User not found. Creating...');
        const { data: newUser, error: createError } = await admin.auth.admin.createUser({
            phone: normalizedPhone,
            password: 'Wyshkit2026!',
            phone_confirm: true
        });
        if (createError) {
            console.error('Create error:', createError);
            return;
        }
        targetUser = newUser.user;
        console.log('Created user:', targetUser.id);
    } else {
        console.log('User found. Updating password...');
        const { error: updateError } = await admin.auth.admin.updateUserById(targetUser.id, {
            password: 'Wyshkit2026!'
        });
        if (updateError) {
            console.error('Update error:', updateError);
        } else {
            console.log('Updated password.');
        }
    }

    console.log('Signing in with password...');
    const { data, error } = await regular.auth.signInWithPassword({
        phone: normalizedPhone,
        password: 'Wyshkit2026!',
    });

    if (error) {
        console.error('SignIn error:', error);
    } else {
        console.log('SignIn success:', data.user.id);
    }
}

run();
