'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { detectContactInfo } from '@/lib/detect-contact'

const taskSchema = z.object({
  title: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().min(5).max(120)),
  description: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().min(20).max(2000)),
  category: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().min(1)),
  tags: z.preprocess(
    (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try { return JSON.parse(String(val)); } catch { return []; }
    },
    z.array(z.string().max(30)).max(5).default([])
  ),
  location_mode: z.preprocess((val) => String(val), z.enum(['remote', 'in_person'])),
  city: z.preprocess((val) => (val === null || val === undefined ? null : String(val)), z.string().max(100).optional().nullable()),
  country: z.preprocess((val) => (val === null || val === undefined ? '' : String(val)), z.string().length(2)),
  compensation_type: z.preprocess((val) => String(val), z.enum(['none', 'paid', 'swap'])),
  amount: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : parseFloat(String(val))),
    z.number().positive().max(1000000).optional()
  ),
  currency: z.preprocess((val) => (val === null || val === undefined ? 'USD' : String(val)), z.string().length(3).default('USD')),
  deadline: z.preprocess((val) => (val === null || val === undefined || val === '' ? null : String(val)), z.string().datetime().optional().nullable()),
  helpers_needed: z.preprocess(
    (val) => (val === null || val === undefined ? 1 : parseInt(String(val)) || 1),
    z.number().int().min(1).max(5).default(1)
  ),
})

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Check profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    return { error: 'Complete your profile first' }
  }

  // Rate limit: max 5 tasks per day
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .gte('created_at', dayAgo)

  if (count !== null && count >= 5) {
    return { error: 'Rate limit: maximum 5 tasks per day' }
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    tags: formData.get('tags'),
    location_mode: formData.get('location_mode'),
    city: formData.get('city'),
    country: formData.get('country'),
    compensation_type: formData.get('compensation_type'),
    amount: formData.get('amount'),
    currency: formData.get('currency'),
    deadline: formData.get('deadline'),
    helpers_needed: formData.get('helpers_needed'),
  }

  const validated = taskSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Detect contact info in public text
  const contactCheck = detectContactInfo(`${validated.data.title} ${validated.data.description}`)
  if (contactCheck.found) {
    return { error: `Please don't include contact information (email, phone, links) in public task fields. ${contactCheck.message}` }
  }

  // Validate compensation fields
  if (validated.data.compensation_type === 'paid' && (!validated.data.amount || validated.data.amount <= 0)) {
    return { error: 'Paid tasks require a positive amount' }
  }
  if (validated.data.compensation_type !== 'paid') {
    validated.data.amount = undefined
    validated.data.currency = 'USD'
  }
  if (validated.data.location_mode === 'remote') {
    validated.data.city = undefined
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      owner_id: user.id,
      ...validated.data,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath('/my/tasks')

  return { success: true, taskId: data.id }
}

export async function updateTask(taskId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    tags: formData.get('tags'),
    location_mode: formData.get('location_mode'),
    city: formData.get('city'),
    country: formData.get('country'),
    compensation_type: formData.get('compensation_type'),
    amount: formData.get('amount'),
    currency: formData.get('currency'),
    deadline: formData.get('deadline'),
    helpers_needed: formData.get('helpers_needed'),
  }

  const validated = taskSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Detect contact info
  const contactCheck = detectContactInfo(`${validated.data.title} ${validated.data.description}`)
  if (contactCheck.found) {
    return { error: `Please don't include contact information (email, phone, links) in public task fields. ${contactCheck.message}` }
  }

  // Validate compensation fields
  if (validated.data.compensation_type === 'paid' && (!validated.data.amount || validated.data.amount <= 0)) {
    return { error: 'Paid tasks require a positive amount' }
  }
  if (validated.data.compensation_type !== 'paid') {
    validated.data.amount = undefined
    validated.data.currency = 'USD'
  }
  if (validated.data.location_mode === 'remote') {
    validated.data.city = undefined
  }

  // Verify ownership
  const { data: task } = await supabase
    .from('tasks')
    .select('owner_id')
    .eq('id', taskId)
    .single()

  if (!task || task.owner_id !== user.id) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('tasks')
    .update(validated.data)
    .eq('id', taskId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/my/tasks')

  return { success: true }
}

export async function changeTaskStatus(taskId: string, status: 'open' | 'closed' | 'done') {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Verify ownership
  const { data: task } = await supabase
    .from('tasks')
    .select('owner_id, status')
    .eq('id', taskId)
    .single()

  if (!task || task.owner_id !== user.id) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/my/tasks')

  return { success: true }
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Verify ownership
  const { data: task } = await supabase
    .from('tasks')
    .select('owner_id')
    .eq('id', taskId)
    .single()

  if (!task || task.owner_id !== user.id) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath('/my/tasks')

  return { success: true }
}