'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Offer } from '@/server/queries/offers'
import { acceptOffer, declineOffer, withdrawOffer } from '@/server/actions/offers'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

interface OfferCardProps {
  offer: Offer
  view: 'inbox' | 'helper'
}

const STATUS_LABELS: Record<Offer['status'], { label: string; className: string; icon: 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'connected' }> = {
  pending: { label: 'Pending', className: 'bg-sun/10 text-sun border-sun/30', icon: 'pending' },
  accepted: { label: 'Accepted', className: 'bg-pine/10 text-pine border-pine/30', icon: 'accepted' },
  declined: { label: 'Declined', className: 'bg-stone/10 text-ink/70 border-stone/30', icon: 'declined' },
  withdrawn: { label: 'Withdrawn', className: 'bg-ink/10 text-ink/50 border-ink/20', icon: 'withdrawn' },
  connected: { label: 'Connected', className: 'bg-pine/20 text-pine border-pine/50', icon: 'connected' },
}

export function OfferCard({ offer, view }: OfferCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const status = STATUS_LABELS[offer.status]

  const handleAccept = async () => {
    setLoading('accept')
    setError(null)
    const result = await acceptOffer(offer.id)
    if (result?.error) {
      setError(result.error)
      setLoading(null)
    } else {
      router.refresh()
      setLoading(null)
    }
  }

  const handleDecline = async () => {
    setLoading('decline')
    setError(null)
    const result = await declineOffer(offer.id)
    if (result?.error) {
      setError(result.error)
      setLoading(null)
    } else {
      router.refresh()
      setLoading(null)
    }
  }

  const handleWithdraw = async () => {
    setLoading('withdraw')
    setError(null)
    const result = await withdrawOffer(offer.id)
    if (result?.error) {
      setError(result.error)
      setLoading(null)
    } else {
      router.refresh()
      setLoading(null)
    }
  }

  const canOwnerAct = view === 'inbox' && offer.status === 'pending'
  const canHelperAct = view === 'helper' && (offer.status === 'pending' || offer.status === 'accepted')

  return (
    <div className="p-4 border border-stone rounded-lg bg-white space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {view === 'inbox' && offer.helper && (
            <Link href={`/u/${offer.helper.handle}`} className="flex items-center gap-2 text-sm text-ink/60 hover:text-pine mb-2">
              <User className="w-4 h-4" />
              <span>@{offer.helper.handle}</span>
              {offer.helper.display_name && (
                <span className="text-ink font-medium">{offer.helper.display_name}</span>
              )}
            </Link>
          )}
          {view === 'helper' && offer.task && (
            <div className="text-sm text-ink/60 mb-2">
              For: <Link href={`/tasks/${offer.task.id}`} className="text-pine hover:underline">{offer.task.title}</Link>
            </div>
          )}
          <p className="text-ink/80 text-sm whitespace-pre-wrap">{offer.message}</p>
          {offer.proposed_amount && (
            <p className="text-sm font-medium text-pine mt-2">Proposed: ${offer.proposed_amount}</p>
          )}
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
          {status.label}
        </span>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center justify-between pt-2 border-t border-stone">
        <span className="text-xs text-ink/50 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
        </span>
        {canOwnerAct && (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleDecline} disabled={loading !== null}>
              {loading === 'decline' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
              Decline
            </Button>
            <Button size="sm" onClick={handleAccept} disabled={loading !== null}>
              {loading === 'accept' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              Accept
            </Button>
          </div>
        )}
        {canHelperAct && (
          <Button size="sm" variant="secondary" onClick={handleWithdraw} disabled={loading !== null}>
            {loading === 'withdraw' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <AlertCircle className="w-4 h-4 mr-1" />}
            Withdraw
          </Button>
        )}
      </div>
    </div>
  )
}