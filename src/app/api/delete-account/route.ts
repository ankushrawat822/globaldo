import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { error } = await supabase.rpc('delete_account')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Also sign out from auth
  await supabase.auth.admin.deleteUser(user.id)

  return NextResponse.json({ success: true })
}