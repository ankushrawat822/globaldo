'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, AlertCircle } from 'lucide-react'
import { createOffer } from '@/server/actions/offers'
import { Task } from '@/server/queries/tasks'

interface OfferHelpModalProps {
  task: Task
  onClose: () => void
}

export function OfferHelpModal({ task, onClose }: OfferHelpModalProps) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [proposedAmount, setProposedAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('task_id', task.id)
    formData.append('message', message)
    if (proposedAmount) {
      formData.append('proposed_amount', proposedAmount)
    }

    const result = await createOffer(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onClose()
      router.push('/my/offers')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-pine">Offer help</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-ink/70 mb-6">
          Tell the owner why you're the right person for <strong>{task.title}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
              Message <span className="text-danger">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm a professional translator with 5 years of experience..."
              required
              maxLength={500}
              rows={4}
              disabled={loading}
              className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine resize-none"
            />
            <p className="text-xs text-ink/50 mt-1 text-right">{message.length}/500</p>
          </div>

          {task.compensation_type === 'paid' && (
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-ink mb-1">
                Proposed amount (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={loading}
                  className="pl-7"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-danger text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button className="flex-1" type="submit" disabled={loading || !message.trim()}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Send Offer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { X } from 'lucide-react'