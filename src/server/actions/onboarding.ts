'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const onboardingSchema = z.object({
  handle: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  display_name: z.string().min(1).max(100),
  country: z.string().length(2),
  bio: z.string().max(280).optional(),
})

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) {
    redirect('/')
  }

  const rawData = {
    handle: formData.get('handle'),
    display_name: formData.get('display_name'),
    country: formData.get('country'),
    bio: formData.get('bio') || '',
  }

  const validated = onboardingSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Check if handle is taken
  const { data: handleTaken } = await supabase
    .from('profiles')
    .select('id')
    .eq('handle', validated.data.handle)
    .maybeSingle()

  if (handleTaken) {
    return { error: 'Handle is already taken' }
  }

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    ...validated.data,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}