'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, X } from 'lucide-react'
import { confirmOffer } from '@/server/actions/offers'
import { ContactMethodPicker } from '@/components/ui/contact-methods'

interface ConfirmOfferModalProps {
  offer: {
    id: string
    task_id: string
    helper_id: string
    message: string
    proposed_amount: number | null
  }
  availableMethods: { id: string; type: string; value: string }[]
  onClose: () => void
}

export function ConfirmOfferModal({ offer, availableMethods, onClose }: ConfirmOfferModalProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one contact method to share')
      return
    }

    setLoading(true)
    setError(null)

    const result = await confirmOffer(offer.id, selectedIds)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onClose()
      router.push('/my/connections')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-pine">Confirm Connection</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-ink/70 mb-6">
          The owner has accepted your offer! Now choose which contact methods you'd like to share with them.
        </p>

        <div className="space-y-4 mb-6">
          <ContactMethodPicker
            availableMethods={availableMethods}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-danger text-sm flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={loading || selectedIds.length === 0}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm and Share'}
          </Button>
        </div>
      </div>
    </div>
  )
}