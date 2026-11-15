'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const reportSchema = z.object({
  target_type: z.enum(['task', 'user', 'offer']),
  target_id: z.string().uuid(),
  reason: z.enum(['spam', 'harassment', 'illegal', 'adult', 'scam', 'other']),
  details: z.string().max(1000).optional(),
})

export async function createReport(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Sign in to report content' }
  }

  const rawData = {
    target_type: formData.get('target_type'),
    target_id: formData.get('target_id'),
    reason: formData.get('reason'),
    details: formData.get('details') || null,
  }

  const validated = reportSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      ...validated.data,
    })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

const blockSchema = z.object({
  blocked_id: z.string().uuid(),
})

export async function blockUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const rawData = {
    blocked_id: formData.get('blocked_id'),
  }

  const validated = blockSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  if (validated.data.blocked_id === user.id) {
    return { error: 'Cannot block yourself' }
  }

  const { error } = await supabase
    .from('blocks')
    .upsert({
      blocker_id: user.id,
      blocked_id: validated.data.blocked_id,
    }, { onConflict: 'blocker_id,blocked_id' })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function unblockUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const blockedId = formData.get('blocked_id')
  if (!blockedId) {
    return { error: 'Missing blocked user ID' }
  }

  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function getBlockedUsers(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blocks')
    .select(`
      blocked_id,
      blocked:profiles!blocks_blocked_id_fkey(handle, display_name, avatar_url)
    `)
    .eq('blocker_id', userId)

  if (error || !data) return []

  return data.map((item: any) => ({
    blocked_id: item.blocked_id,
    blocked: {
      handle: item.blocked?.handle || '',
      display_name: item.blocked?.display_name || '',
      avatar_url: item.blocked?.avatar_url || null,
    }
  }))
}

// Admin actions
export async function hideTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only' }

  const taskId = formData.get('task_id')
  if (!taskId) return { error: 'Missing task ID' }

  const { error } = await supabase
    .from('tasks')
    .update({ status: 'hidden', updated_at: new Date().toISOString() })
    .eq('id', taskId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function suspendUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only' }

  const targetId = formData.get('target_id')
  if (!targetId) return { error: 'Missing user ID' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_suspended: true })
    .eq('id', targetId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function unsuspendUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only' }

  const targetId = formData.get('target_id')
  if (!targetId) return { error: 'Missing user ID' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_suspended: false })
    .eq('id', targetId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function resolveReport(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only' }

  const reportId = formData.get('report_id')
  if (!reportId) return { error: 'Missing report ID' }

  const { error } = await supabase
    .from('reports')
    .update({ status: 'actioned' })
    .eq('id', reportId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}