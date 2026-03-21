import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a proxy or throw a more helpful error if needed, 
    // but for the UI to not crash during build/prerender:
    console.warn("Supabase URL or Key is missing. Client functionality will be limited.");
    return null as any; 
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
