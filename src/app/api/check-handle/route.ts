import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { handle } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!handle || handle.length < 3) {
      return NextResponse.json({ available: false })
    }

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('handle', handle)
      .neq('id', user?.id || '')
      .maybeSingle()

    return NextResponse.json({ available: !data })
  } catch {
    return NextResponse.json({ available: false }, { status: 500 })
  }
}