import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getUserConnections } from '@/server/queries/offers'
import { format } from 'date-fns'
import Link from 'next/link'

async function ConnectionsContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my/connections')
  }

  const connections = await getUserConnections(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-heading font-semibold text-pine">My Connections</h1>
      </div>

      {connections.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {connections.map((conn) => (
            <div key={conn.id} className="p-6 border border-stone rounded-lg bg-white space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-pine/10 flex items-center justify-center text-pine font-bold text-xl">
                    {conn.helper?.display_name?.[0] || conn.helper?.handle?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-ink">
                      {conn.helper?.display_name} (@{conn.helper?.handle})
                    </p>
                    <p className="text-sm text-ink/60">Connected on {format(new Date(conn.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/tasks/${conn.task_id}`}>
                    <Button variant="secondary" size="sm">View Task</Button>
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-paper rounded-lg border border-stone">
                <h3 className="text-sm font-semibold text-ink mb-3">Shared Contacts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conn.shares?.map((share, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink/80">
                      <span className="px-2 py-0.5 rounded bg-stone/50 text-stone text-xs capitalize">
                        {share.type}
                      </span>
                      <span className="font-medium">{share.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state py-16 border border-stone rounded-lg text-center">
          <p className="text-lg text-ink/70 mb-2">No connections yet.</p>
          <p className="text-sm text-ink/60 mb-4">Once you accept an offer or your offer is confirmed, you'll see connections here.</p>
          <Link href="/tasks">
            <Button>Browse Tasks</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function ConnectionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-48 rounded mb-4" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="skeleton h-40 rounded-lg border border-stone" />
        ))}
      </div>
    </div>
  )
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<ConnectionsSkeleton />}>
      <ConnectionsContent />
    </Suspense>
  )
}