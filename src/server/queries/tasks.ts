import { createClient } from '@/lib/supabase/server'

export interface TaskFilters {
  query?: string
  category?: string
  status?: string
  location_mode?: 'remote' | 'in_person'
  country?: string
  compensation_type?: 'none' | 'paid' | 'swap'
  deadline_before?: string
  helpers_needed?: number
  sort?: 'newest' | 'deadline'
  cursor?: string
  limit?: number
}

export interface Task {
  id: string
  owner_id: string
  title: string
  description: string
  category: string
  tags: string[]
  location_mode: 'remote' | 'in_person'
  city: string | null
  country: string
  compensation_type: 'none' | 'paid' | 'swap'
  amount: number | null
  currency: string
  deadline: string | null
  helpers_needed: number
  status: 'open' | 'in_progress' | 'done' | 'closed' | 'expired' | 'hidden'
  created_at: string
  updated_at: string
  owner?: {
    handle: string
    display_name: string
    avatar_url: string | null
  }
  _count?: {
    offers: number
  }
}

export async function getTasks(filters: TaskFilters = {}): Promise<{ tasks: Task[]; nextCursor: string | null }> {
  const supabase = await createClient()

  const {
    query,
    category,
    status = 'open',
    location_mode,
    country,
    compensation_type,
    deadline_before,
    helpers_needed,
    sort = 'newest',
    cursor,
    limit = 20,
  } = filters

  let queryBuilder = supabase
    .from('tasks')
    .select(`
      id, owner_id, title, description, category, tags, location_mode, city, country,
      compensation_type, amount, currency, deadline, helpers_needed, status, created_at, updated_at,
      owner:profiles!tasks_owner_id_fkey(handle, display_name, avatar_url),
      offers:offers!offers_task_id_fkey(count)
    `)
    .neq('status', 'hidden')

  // Apply filters
  if (status) {
    queryBuilder = queryBuilder.eq('status', status)
  }

  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }

  if (location_mode) {
    queryBuilder = queryBuilder.eq('location_mode', location_mode)
  }

  if (country) {
    queryBuilder = queryBuilder.eq('country', country)
  }

  if (compensation_type) {
    queryBuilder = queryBuilder.eq('compensation_type', compensation_type)
  }

  if (helpers_needed) {
    queryBuilder = queryBuilder.gte('helpers_needed', helpers_needed)
  }

  if (deadline_before) {
    queryBuilder = queryBuilder.lte('deadline', deadline_before)
  }

  // Full-text search
  if (query) {
    queryBuilder = queryBuilder.textSearch('title || \' \' || description', query, {
      type: 'websearch',
      config: 'english',
    })
  }

  // Cursor-based pagination
  if (cursor) {
    const decoded = Buffer.from(cursor, 'base64').toString()
    const [createdAt, id] = decoded.split('|')
    queryBuilder = queryBuilder.or(`created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${id})`)
  }

  // Sorting
  if (sort === 'deadline') {
    queryBuilder = queryBuilder.order('deadline', { ascending: true, nullsFirst: false })
  } else {
    queryBuilder = queryBuilder.order('created_at', { ascending: false })
  }

  // Limit + 1 to check if there are more
  queryBuilder = queryBuilder.limit(limit + 1)

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Error fetching tasks:', error)
    return { tasks: [], nextCursor: null }
  }

  const rawTasks = data || []
  const tasks: Task[] = rawTasks.map((t: any) => ({
    ...t,
    owner: t.owner?.[0] || t.owner || null,
  }))
  let nextCursor: string | null = null

  if (tasks.length > limit) {
    const lastTask = tasks[limit - 1]
    nextCursor = Buffer.from(`${lastTask.created_at}|${lastTask.id}`).toString('base64')
    tasks.pop() // Remove the extra item
  }

  return { tasks, nextCursor }
}

export async function getTaskById(id: string): Promise<Task | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id, owner_id, title, description, category, tags, location_mode, city, country,
      compensation_type, amount, currency, deadline, helpers_needed, status, created_at, updated_at,
      owner:profiles!tasks_owner_id_fkey(handle, display_name, avatar_url),
      offers:offers!offers_task_id_fkey(count)
    `)
    .eq('id', id)
    .neq('status', 'hidden')
    .single()

  if (error || !data) return null
  return data as unknown as Task
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id, owner_id, title, description, category, tags, location_mode, city, country,
      compensation_type, amount, currency, deadline, helpers_needed, status, created_at, updated_at,
      owner:profiles!tasks_owner_id_fkey(handle, display_name, avatar_url),
      offers:offers!offers_task_id_fkey(count)
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as Task[]
}

export function getCategories(): string[] {
  return [
    'Writing & translation',
    'Design & creative',
    'Tech & coding',
    'Tutoring & learning',
    'Errands & local help',
    'Home & repair',
    'Admin & research',
    'Health & wellness (non-medical)',
    'Events & community',
    'Other'
  ]
}