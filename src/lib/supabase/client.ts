import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Make sure that the client is a singleton
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}