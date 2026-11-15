'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { completeOnboarding } from '@/server/actions/onboarding'

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'IL', name: 'Israel' },
  { code: 'ZA', name: 'South Africa' },
]

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [handle, setHandle] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [country, setCountry] = useState('US')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [handleAvailable, setHandleAvailable] = useState<null | boolean>(null)
  const [checkingHandle, setCheckingHandle] = useState(false)

  const checkHandleAvailability = async (value: string) => {
    if (value.length < 3) {
      setHandleAvailable(false)
      return
    }
    setCheckingHandle(true)
    try {
      const res = await fetch('/api/check-handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: value })
      })
      const data = await res.json()
      setHandleAvailable(data.available)
    } catch {
      setHandleAvailable(false)
    }
    setCheckingHandle(false)
  }

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    await checkHandleAvailability(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!handleAvailable) {
      setMessage({ type: 'error', text: 'Handle is not available' })
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('handle', handle)
    formData.append('display_name', displayName)
    formData.append('country', country)
    formData.append('bio', bio)

    const result = await completeOnboarding(formData)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile created! Redirecting...' })
      setTimeout(() => router.push(redirectTo), 1000)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-heading font-semibold text-pine mb-2 text-center">Welcome to GlobalDo</h1>
      <p className="text-ink/70 text-center mb-8">
        Set up your profile to start posting tasks and offering help.
      </p>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          } flex items-center gap-2`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="handle" className="block text-sm font-medium text-ink mb-1">
            Handle <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">@</span>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                setHandleAvailable(null)
              }}
              onBlur={handleBlur}
              placeholder="yourhandle"
              required
              minLength={3}
              maxLength={20}
              disabled={loading}
              className="pl-7"
            />
            {checkingHandle && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-ink/40" />}
            {handleAvailable === true && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
            {handleAvailable === false && handle.length >= 3 && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
          </div>
          <p className="text-sm text-ink/60 mt-1">3–20 characters, letters, numbers, and underscores only.</p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-ink mb-1">
            Display name <span className="text-danger">*</span>
          </label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your Name"
            required
            maxLength={100}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-ink mb-1">
            Country <span className="text-danger">*</span>
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            disabled={loading}
            className="w-full pl-4 pr-10 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine appearance-none bg-white"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-ink mb-1">
            Bio (optional)
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            maxLength={280}
            rows={3}
            disabled={loading}
            className="w-full pl-4 pr-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine resize-none"
          />
          <p className="text-sm text-ink/60 mt-1 text-right">{bio.length}/280</p>
        </div>

        <Button type="submit" className="w-full" disabled={loading || !handleAvailable}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Create Profile'}
        </Button>
      </form>
    </div>
  )
}

function OnboardingFallback() {
  return (
    <div className="max-w-md mx-auto py-12">
      <div className="skeleton h-10 w-3/4 mx-auto mb-4 rounded" />
      <div className="skeleton h-6 w-full mx-auto mb-8 rounded" />
      <div className="space-y-4">
        <div className="skeleton h-10 rounded" />
        <div className="skeleton h-10 rounded" />
        <div className="skeleton h-10 rounded" />
        <div className="skeleton h-20 rounded" />
        <div className="skeleton h-12 rounded w-1/2 mx-auto" />
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingContent />
    </Suspense>
  )
}