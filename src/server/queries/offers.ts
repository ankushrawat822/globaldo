import { createClient } from '@/lib/supabase/server'

export interface Offer {
  id: string
  task_id: string
  helper_id: string
  message: string
  proposed_amount: number | null
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'connected'
  created_at: string
  updated_at: string
  helper?: {
    handle: string
    display_name: string
    avatar_url: string | null
  }
  task?: {
    id: string
    title: string
    owner_id: string
  }
}

export interface Connection {
  id: string
  offer_id: string
  task_id: string
  owner_id: string
  helper_id: string
  created_at: string
  owner?: {
    handle: string
    display_name: string
    avatar_url: string | null
    contact_methods?: Array<{ type: string; value: string }>
  }
  helper?: {
    handle: string
    display_name: string
    avatar_url: string | null
    contact_methods?: Array<{ type: string; value: string }>
  }
  task?: {
    id: string
    title: string
    category: string
  }
  shares?: Array<{ type: string; value: string }>
}

export async function getOffersForTask(taskId: string): Promise<Offer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      id, task_id, helper_id, message, proposed_amount, status, created_at, updated_at,
      helper:profiles!offers_helper_id_fkey(handle, display_name, avatar_url)
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching offers:', error)
    return []
  }

  return data as unknown as Offer[]
}

export async function getUserOffers(userId: string): Promise<Offer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      id, task_id, helper_id, message, proposed_amount, status, created_at, updated_at,
      task:tasks!offers_task_id_fkey(id, title, owner_id)
    `)
    .eq('helper_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user offers:', error)
    return []
  }

  return data as unknown as Offer[]
}

export async function getOfferById(offerId: string): Promise<Offer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      id, task_id, helper_id, message, proposed_amount, status, created_at, updated_at,
      helper:profiles!offers_helper_id_fkey(handle, display_name, avatar_url),
      task:tasks!offers_task_id_fkey(id, title, owner_id)
    `)
    .eq('id', offerId)
    .single()

  if (error || !data) return null
  return data as unknown as Offer
}

export async function getConnectionByOfferId(offerId: string): Promise<Connection | null> {
  const supabase = await createClient()

  const { data: connection, error } = await supabase
    .from('connections')
    .select(`
      id, offer_id, task_id, owner_id, helper_id, created_at,
      owner:profiles!connections_owner_id_fkey(handle, display_name, avatar_url),
      helper:profiles!connections_helper_id_fkey(handle, display_name, avatar_url),
      task:tasks!connections_task_id_fkey(id, title, category)
    `)
    .eq('offer_id', offerId)
    .single()

  if (error || !connection) return null

  // Get shares for this connection
  const { data: shares } = await supabase
    .from('connection_shares')
    .select('type, value')
    .eq('connection_id', connection.id)

  return {
    ...connection,
    shares: shares || []
  } as unknown as Connection
}

export async function getUserConnections(userId: string): Promise<Connection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('connections')
    .select(`
      id, offer_id, task_id, owner_id, helper_id, created_at,
      owner:profiles!connections_owner_id_fkey(handle, display_name, avatar_url),
      helper:profiles!connections_helper_id_fkey(handle, display_name, avatar_url),
      task:tasks!connections_task_id_fkey(id, title, category)
    `)
    .or(`owner_id.eq.${userId},helper_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching connections:', error)
    return []
  }

  return data as unknown as Connection[]
}

export async function getContactMethods(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contact_methods')
    .select('id, type, value')
    .eq('user_id', userId)
    .order('type')

  if (error) return []
  return data
}