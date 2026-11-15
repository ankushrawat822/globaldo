import { createClient } from '@/lib/supabase/server'

export interface User {
  id: string
  email: string
  handle?: string
  display_name?: string
  avatar_url?: string
  country?: string
  is_admin?: boolean
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    handle: user.user_metadata?.handle,
    display_name: user.user_metadata?.display_name,
    avatar_url: user.user_metadata?.avatar_url,
    country: user.user_metadata?.country,
    is_admin: user.user_metadata?.is_admin,
  }
}

export async function requireUser(): Promise<User> {
  const user = await getUser()

  if (!user) {
    // In Next.js, we would typically redirect to login
    // For now, throw an error that can be caught by middleware
    throw new Error('Authentication required')
  }

  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser()

  // Check if user is admin either via is_admin flag or email
  const isAdmin = user.is_admin || user.email === 'slave.container01@gmail.com'

  if (!isAdmin) {
    throw new Error('Admin access required')
  }

  return user
}