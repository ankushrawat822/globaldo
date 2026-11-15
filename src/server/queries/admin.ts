import { createClient } from '@/lib/supabase/server'

export async function getReports() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reports')
    .select(`
      id, reporter_id, target_type, target_id, reason, details, status, created_at,
      reporter:profiles!reports_reporter_id_fkey(handle, display_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !data) return []

  return data.map((item: any) => ({
    ...item,
    reporter: item.reporter?.[0] || item.reporter || null,
  }))
}

export async function getReportedTasks() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id, title, owner_id, status, created_at,
      owner:profiles!tasks_owner_id_fkey(handle, display_name)
    `)
    .eq('status', 'hidden')
    .order('updated_at', { ascending: false })
    .limit(50)

  if (error || !data) return []

  return data.map((item: any) => ({
    ...item,
    owner: item.owner?.[0] || item.owner || null,
  }))
}

export async function getSuspendedUsers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, handle, display_name, is_suspended, created_at')
    .eq('is_suspended', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return []
  return data
}