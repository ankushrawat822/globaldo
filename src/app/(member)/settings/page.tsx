'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle, AlertCircle, Trash2, UserCheck, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/server/actions/profile'
import { unblockUser, getBlockedUsers } from '@/server/actions/trust'

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

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [handle, setHandle] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [country, setCountry] = useState('US')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [handleAvailable, setHandleAvailable] = useState<null | boolean>(null)
  const [checkingHandle, setCheckingHandle] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState<Array<{ blocked_id: string; blocked: { handle: string; display_name: string; avatar_url: string | null } }>>([])
  const [loadingBlocked, setLoadingBlocked] = useState(false)

  useEffect(() => {
    const loadBlocked = async () => {
      setLoadingBlocked(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const blocked = await getBlockedUsers(user.id)
        setBlockedUsers(blocked)
      }
      setLoadingBlocked(false)
    }
    loadBlocked()
  }, [supabase])

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('handle, display_name, country, bio, avatar_url')
        .eq('id', user.id)
        .single()

      if (profile) {
        setHandle(profile.handle)
        setDisplayName(profile.display_name)
        setCountry(profile.country || 'US')
        setBio(profile.bio || '')
        setAvatarUrl(profile.avatar_url || '')
        setHandleAvailable(true)
      }
      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const checkHandleAvailability = async (value: string) => {
    if (value === handle) {
      setHandleAvailable(true)
      return
    }
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    if (!handleAvailable) {
      setMessage({ type: 'error', text: 'Handle is not available' })
      setSaving(false)
      return
    }

    const formData = new FormData()
    formData.append('handle', handle)
    formData.append('display_name', displayName)
    formData.append('country', country)
    formData.append('bio', bio)
    formData.append('avatar_url', avatarUrl)

    const result = await updateProfile(formData)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile saved!' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/delete-account', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setMessage({ type: 'error', text: data.error })
        setDeleting(false)
      } else {
        await supabase.auth.signOut()
        router.push('/')
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete account' })
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine" />
        <p className="mt-4 text-ink/70">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-pine mb-2">Settings</h1>
        <p className="text-ink/70">Manage your profile and account.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          } flex items-center gap-2`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <section className="space-y-6 p-6 border border-stone rounded-lg">
        <h2 className="text-xl font-heading font-semibold text-ink">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
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
                disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-ink mb-1">
              Avatar URL (optional)
            </label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              disabled={saving}
            />
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
              disabled={saving}
              className="w-full pl-4 pr-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine resize-none"
            />
            <p className="text-sm text-ink/60 mt-1 text-right">{bio.length}/280</p>
          </div>

          <Button type="submit" disabled={saving || !handleAvailable}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
          </Button>
        </form>
      </section>

      <section className="space-y-4 p-6 border border-stone rounded-lg bg-pine/5">
        <h2 className="text-xl font-heading font-semibold text-ink flex items-center gap-2">
          <Shield className="w-5 h-5 text-pine" />
          Blocked Users
        </h2>
        <p className="text-sm text-ink/70">Blocked users cannot offer on your tasks or contact you.</p>
        {loadingBlocked ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-pine" />
            <span className="text-sm text-ink/60">Loading...</span>
          </div>
        ) : blockedUsers.length === 0 ? (
          <p className="text-sm text-ink/60">You haven't blocked anyone yet.</p>
        ) : (
          <div className="space-y-2">
            {blockedUsers.map((blocked) => (
              <div key={blocked.blocked_id} className="flex items-center justify-between p-3 border border-stone rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pine/10 flex items-center justify-center text-pine font-bold text-sm">
                    {blocked.blocked.display_name?.[0] || blocked.blocked.handle?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{blocked.blocked.display_name} (@{blocked.blocked.handle})</p>
                  </div>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData()
                  formData.append('blocked_id', blocked.blocked_id)
                  await unblockUser(formData)
                  // Refresh blocked users
                  const { data: { user } } = await supabase.auth.getUser()
                  if (user) {
                    const blocked = await getBlockedUsers(user.id)
                    setBlockedUsers(blocked)
                  }
                }}>
                  <input type="hidden" name="blocked_id" value={blocked.blocked_id} />
                  <Button type="submit" variant="secondary" size="sm">
                    <UserCheck className="w-4 h-4 mr-1" />
                    Unblock
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 p-6 border border-stone rounded-lg bg-red-50">
        <h2 className="text-xl font-heading font-semibold text-danger">Danger Zone</h2>
        <p className="text-sm text-ink/70">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
        <Button
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
        >
          {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete Account
        </Button>

        {showDeleteConfirm && (
          <div className="flex gap-2">
            <Button variant="danger" onClick={handleDelete} disabled={deleting} size="sm">
              Yes, delete my account
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} size="sm">
              Cancel
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}