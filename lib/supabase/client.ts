import { createBrowserClient } from '@supabase/ssr'
import { createSafeFetch } from './fetch'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
  return createBrowserClient(url, key, {
    global: {
      fetch: createSafeFetch(url),
    },
  })
}
