'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { detectContactInfo } from '@/lib/detect-contact'

const offerSchema = z.object({
  task_id: z.string().uuid(),
  message: z.string().min(10).max(500),
  proposed_amount: z.number().positive().max(1000000).optional(),
})

export async function createOffer(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Sign in to offer help. It takes about 10 seconds.' }
  }

  // Check profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, is_suspended')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    return { error: 'Complete your profile first' }
  }

  if (profile.is_suspended) {
    return { error: 'Suspended users cannot make offers' }
  }

  const rawData = {
    task_id: formData.get('task_id'),
    message: formData.get('message'),
    proposed_amount: formData.get('proposed_amount') ? parseFloat(formData.get('proposed_amount') as string) : null,
  }

  const validated = offerSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Detect contact info
  const contactCheck = detectContactInfo(validated.data.message)
  if (contactCheck.found) {
    return { error: `Please don't include contact information in your message. ${contactCheck.message}` }
  }

  // Check task exists and is open
  const { data: task } = await supabase
    .from('tasks')
    .select('id, owner_id, status, helpers_needed')
    .eq('id', validated.data.task_id)
    .single()

  if (!task) {
    return { error: 'Task not found' }
  }

  if (task.status !== 'open' && task.status !== 'in_progress') {
    return { error: 'Task is not accepting offers' }
  }

  if (task.owner_id === user.id) {
    return { error: 'Cannot offer on your own task' }
  }

  // Check if already offered
  const { data: existing } = await supabase
    .from('offers')
    .select('id')
    .eq('task_id', validated.data.task_id)
    .eq('helper_id', user.id)
    .maybeSingle()

  if (existing) {
    return { error: 'You have already offered on this task' }
  }

  // Check blocks
  const { data: blocked } = await supabase
    .from('blocks')
    .select('id')
    .eq('blocker_id', task.owner_id)
    .eq('blocked_id', user.id)
    .maybeSingle()

  if (blocked) {
    return { error: 'You are blocked by this task owner' }
  }

  // Insert offer
  const { data, error } = await supabase
    .from('offers')
    .insert({
      task_id: validated.data.task_id,
      helper_id: user.id,
      message: validated.data.message,
      proposed_amount: validated.data.proposed_amount,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/tasks/${validated.data.task_id}`)
  revalidatePath('/my/offers')

  return { success: true, offerId: data.id }
}

export async function acceptOffer(offerId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.rpc('accept_offer', { p_offer_id: offerId })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/my/tasks')
  revalidatePath('/my/offers')
  revalidatePath(`/tasks/`)

  return { success: true }
}

export async function declineOffer(offerId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.rpc('decline_offer', { p_offer_id: offerId })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/my/tasks')
  revalidatePath('/my/offers')

  return { success: true }
}

export async function withdrawOffer(offerId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.rpc('withdraw_offer', { p_offer_id: offerId })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/my/tasks')
  revalidatePath('/my/offers')
  revalidatePath(`/tasks/`)

  return { success: true }
}

export async function confirmOffer(offerId: string, contactMethodIds: string[]) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.rpc('confirm_offer', {
    p_offer_id: offerId,
    p_contact_method_ids: contactMethodIds
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/my/offers')
  revalidatePath('/my/connections')
  revalidatePath('/my/tasks')

  return { success: true }
}