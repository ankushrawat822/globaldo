import { createClient } from '@/lib/supabase/server'

export async function getProfileByHandle(handle: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, handle, display_name, avatar_url, bio, country, is_admin, created_at')
    .eq('handle', handle)
    .maybeSingle()

  if (error) return null
  return data
}

export async function getProfileById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, handle, display_name, avatar_url, bio, country, is_admin, is_suspended, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) return null
  return data
}

export async function getUserTaskCounts(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('status', { count: 'exact' })
    .eq('owner_id', userId)
    .neq('status', 'hidden')

  if (error) return { total: 0, open: 0, completed: 0 }
  return {
    total: data?.length || 0,
    open: data?.filter(t => t.status === 'open' || t.status === 'in_progress').length || 0,
    completed: data?.filter(t => t.status === 'done').length || 0,
  }
}