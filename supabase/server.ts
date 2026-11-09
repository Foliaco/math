// ./server.ts
import { createServerClient } from '@supabase/ssr';
import { Database } from './database.types';
import { cookies } from 'next/headers';


const URL = process.env.SUPABASE_PROJECT_URL!;
const KEY = process.env.SUPABASE_API_KEY!;




export async function createClient() {
    return createServerClient<Database>(URL, KEY, {
        cookies: {
            async getAll() {
                const cookieStore = await cookies();
                return cookieStore.getAll();
            },
            async setAll(cookiesToSet) {
                try {
                    const cookieStore = await cookies();
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Ignorar errores si se ejecuta desde un Server Component
                }
            },
        },
    });
}
