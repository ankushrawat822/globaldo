import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getUserOffers, getContactMethods } from '@/server/queries/offers'
import Link from 'next/link'
import MyOffersClient from '@/components/MyOffersClient'

async function MyOffersContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my/offers')
  }

  const offers = await getUserOffers(user.id)
  const contacts = await getContactMethods(user.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-semibold text-pine">My Offers</h1>
        <Link href="/tasks">
          <Button variant="secondary">Browse Tasks</Button>
        </Link>
      </div>

      {offers.length > 0 ? (
        <MyOffersClient offers={offers} userContacts={contacts} />
      ) : (
        <div className="empty-state py-16 border border-stone rounded-lg text-center">
          <p className="text-lg text-ink/70 mb-2">You haven't made any offers yet.</p>
          <Link href="/tasks">
            <Button>Find a task to help with</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function MyOffersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="skeleton h-10 w-32 rounded" />
        <div className="skeleton h-10 w-48 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-40 rounded-lg border border-stone" />
        ))}
      </div>
    </div>
  )
}

export default function MyOffersPage() {
  return (
    <Suspense fallback={<MyOffersSkeleton />}>
      <MyOffersContent />
    </Suspense>
  )
}