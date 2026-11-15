'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { OfferCard } from '@/components/ui/offer-card'
import { ConfirmOfferModal } from '@/components/ui/confirm-offer-modal'

interface MyOffersClientPageProps {
  offers: any[]
  userContacts: any[]
}

export default function MyOffersClientPage({ offers, userContacts }: MyOffersClientPageProps) {
  const [confirmingOffer, setConfirmingOffer] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {offers.map((offer) => (
        <div key={offer.id} className="relative">
          <OfferCard
            offer={offer}
            view="helper"
          />
          {offer.status === 'accepted' && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => setConfirmingOffer(offer.id)}
            >
              Confirm and Share Contacts
            </Button>
          )}
        </div>
      ))}
      {confirmingOffer && (
        <ConfirmOfferModal
          offer={offers.find(o => o.id === confirmingOffer)}
          availableMethods={userContacts}
          onClose={() => setConfirmingOffer(null)}
        />
      )}
    </div>
  )
}