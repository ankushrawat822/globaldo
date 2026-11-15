'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createReport } from '@/server/actions/trust'
import { Loader2, AlertCircle, X } from 'lucide-react'

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or commercial content' },
  { value: 'harassment', label: 'Harassment or abuse' },
  { value: 'illegal', label: 'Illegal activity' },
  { value: 'adult', label: 'Adult content' },
  { value: 'scam', label: 'Scam or fraud' },
  { value: 'other', label: 'Other' },
]

interface ReportModalProps {
  targetType: 'task' | 'user' | 'offer'
  targetId: string
  onClose: () => void
  onSuccess?: () => void
}

export function ReportModal({ targetType, targetId, onClose, onSuccess }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!reason) {
      setError('Please select a reason')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('target_type', targetType)
    formData.append('target_id', targetId)
    formData.append('reason', reason)
    if (details) formData.append('details', details)

    const result = await createReport(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-pine">Report</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-ink/70 mb-6">
          Help us keep GlobalDo safe. Reports are reviewed by our moderation team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Reason <span className="text-danger">*</span></label>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="w-4 h-4 text-pine border-stone rounded focus:ring-pine"
                  />
                  <span className="text-sm text-ink">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-ink mb-1">
              Details (optional)
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional context..."
              maxLength={1000}
              rows={3}
              disabled={loading}
              className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine resize-none"
            />
            <p className="text-xs text-ink/50 mt-1 text-right">{details.length}/1000</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-danger text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button className="flex-1" type="submit" disabled={loading || !reason}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}