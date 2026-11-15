'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Mail, MailCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic link!' })
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-heading font-semibold text-pine mb-2 text-center">Sign In</h1>
      <p className="text-ink/70 text-center mb-8">
        Sign in with a magic link or Google. No passwords required.
      </p>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine"
              disabled={loading}
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-ink/50">Or continue with</span>
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleGoogle}
        disabled={loading}
      >
        <MailCheck className="w-4 h-4 mr-2" />
        Continue with Google
      </Button>

      <p className="text-center text-sm text-ink/60 mt-6">
        By signing in, you agree to our{' '}
        <a href="/terms" className="underline hover:text-pine">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="underline hover:text-pine">Privacy Policy</a>.
      </p>
    </div>
  )
}