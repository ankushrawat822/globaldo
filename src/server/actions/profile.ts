'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const profileSchema = z.object({
  handle: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  display_name: z.string().min(1).max(100),
  country: z.string().length(2),
  bio: z.string().max(280).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const rawData = {
    handle: formData.get('handle'),
    display_name: formData.get('display_name'),
    country: formData.get('country'),
    bio: formData.get('bio') || '',
    avatar_url: formData.get('avatar_url') || '',
  }

  const validated = profileSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Check if handle is taken by another user
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('handle', validated.data.handle)
    .neq('id', user.id)
    .maybeSingle()

  if (existing) {
    return { error: 'Handle is already taken' }
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...validated.data,
    avatar_url: validated.data.avatar_url || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  revalidatePath(`/u/${validated.data.handle}`)
  return { success: true }
}

export async function createProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const rawData = {
    handle: formData.get('handle'),
    display_name: formData.get('display_name'),
    country: formData.get('country'),
    bio: formData.get('bio') || '',
  }

  const validated = profileSchema.omit({ avatar_url: true }).safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Check if handle is taken
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('handle', validated.data.handle)
    .maybeSingle()

  if (existing) {
    return { error: 'Handle is already taken' }
  }

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    ...validated.data,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function checkHandleAvailability(handle: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!handle || handle.length < 3) {
    return { available: false }
  }

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('handle', handle)
    .neq('id', user?.id || '')
    .maybeSingle()

  return { available: !data }
}