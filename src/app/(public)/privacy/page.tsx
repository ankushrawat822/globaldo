import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-heading font-semibold text-pine mb-4">Privacy Policy</h1>
      <p className="text-sm text-ink/60 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">1. Data We Collect</h2>
        <h3 className="text-lg font-semibold text-ink">Account Information</h3>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Email address (via Supabase Auth)</li>
          <li>Chosen handle, display name, country, bio, avatar URL</li>
        </ul>
        <h3 className="text-lg font-semibold text-ink mt-4">Contact Methods (Private)</h3>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Email, phone, Telegram, WhatsApp, Instagram, X, LinkedIn, or other URL</li>
          <li>These are NEVER displayed publicly or in search results</li>
        </ul>
        <h3 className="text-lg font-semibold text-ink mt-4">Usage Data</h3>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Tasks posted, offers sent/received, connections made</li>
          <li>IP address and browser info (via Supabase Auth for security)</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>To create and manage your account</li>
          <li>To display your public profile (handle, display name, bio, country, task counts)</li>
          <li>To enable the task/offer/connection workflow</li>
          <li>To share your CHOSEN contact methods ONLY with your confirmed counterparty</li>
          <li>For security, fraud prevention, and legal compliance</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">3. Contact Information Protection</h2>
        <p className="text-ink/80">
          This is our core privacy principle: <strong>Your contact methods are never public.</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 text-ink/80 mt-4">
          <li>Contact methods are stored encrypted in our database with owner-only RLS policies.</li>
          <li>They are only copied to the <code>connection_shares</code> table when BOTH parties confirm.</li>
          <li>You choose exactly which methods to share per connection.</li>
          <li>No contact information appears in search results, task feeds, or public profiles.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">4. Data Sharing</h2>
        <p className="text-ink/80">We do not sell your data. We share data only:</p>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>With your confirmed counterparty (the contact methods you explicitly choose to share)</li>
          <li>With Supabase (our database/auth provider) under their privacy policy</li>
          <li>When required by law or to protect rights/safety</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">5. Data Retention & Deletion</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Account data: Retained while your account is active</li>
          <li>On account deletion: All personal data is permanently removed via our <code>delete_account</code> function (tasks, offers, connections, contact methods, blocks, reports)</li>
          <li>Anonymized analytics may be retained</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">6. Security</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Row Level Security (RLS) on all database tables</li>
          <li>Supabase Auth with magic links + Google OAuth (no passwords stored)</li>
          <li>Server-side validation on all mutations</li>
          <li>Contact info detection to prevent accidental exposure</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">7. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Access: View your data via your profile and Settings</li>
          <li>Rectification: Edit your profile and contact methods anytime</li>
          <li>Erasure: Delete your account in Settings (irreversible)</li>
          <li>Portability: Your data is accessible via your profile</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-heading font-semibold text-ink">8. Contact</h2>
        <p className="text-ink/80">
          Questions about this policy? Contact us at <a href="mailto:slave.container01@gmail.com" className="underline hover:text-pine">slave.container01@gmail.com</a>.
        </p>
      </section>

      <Link href="/terms" className="text-pine hover:underline mt-8 inline-block">
        Read our Terms of Service →
      </Link>
    </div>
  )
}