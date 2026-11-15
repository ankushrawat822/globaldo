import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OfferCard } from '@/components/ui/offer-card'
import { getOffersForTask } from '@/server/queries/offers'
import { getTaskById } from '@/server/queries/tasks'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function OffersContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: taskId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my/tasks/' + taskId + '/offers')
  }

  const task = await getTaskById(taskId)
  if (!task) {
    return <div className="py-12 text-center">Task not found</div>
  }

  if (task.owner_id !== user.id) {
    redirect('/tasks/' + taskId)
  }

  const offers = await getOffersForTask(taskId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/my/tasks`} className="p-2 hover:bg-stone rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-semibold text-pine">Offers</h1>
          <p className="text-sm text-ink/60">{task.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} view="inbox" />
          ))
        ) : (
          <div className="col-span-full empty-state py-16 border border-stone rounded-lg text-center">
            <p className="text-lg text-ink/70 mb-2">No offers yet.</p>
            <p className="text-sm text-ink/60">When someone offers to help, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OffersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="skeleton h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-4 w-48 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-40 rounded-lg border border-stone" />
        ))}
      </div>
    </div>
  )
}

export default function OffersPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<OffersSkeleton />}>
      <OffersContent params={params} />
    </Suspense>
  )
}