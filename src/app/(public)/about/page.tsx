import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-heading font-semibold text-pine mb-4">How GlobalDo Works</h1>
        <p className="text-lg text-ink/70 max-w-2xl mx-auto">
          A global public board of to-dos. Post what you need done; others who can help offer to connect.
          Contact details are shared only when both sides agree.
        </p>
      </header>

      <section className="space-y-10">
        <article className="p-6 border border-stone rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-2xl font-bold">1</div>
            <h2 className="text-2xl font-heading font-semibold text-ink">Post a Task</h2>
          </div>
          <p className="text-ink/70">
            Create an account (or sign in), then describe what you need done. Add a title, detailed description, category, tags, location (remote or in-person with city/country), compensation type (free, paid, or skill swap), deadline, and how many helpers you need.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ink/70">
            <li>No account needed to browse — only to post</li>
            <li>Rate limited to 5 new tasks per day</li>
            <li>Contact info in public fields is automatically blocked</li>
          </ul>
        </article>

        <article className="p-6 border border-stone rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-2xl font-bold">2</div>
            <h2 className="text-2xl font-heading font-semibold text-ink">Receive Offers</h2>
          </div>
          <p className="text-ink/70">
            Logged-in users can send offers with a message explaining why they're a good fit. For paid tasks, they can propose a different amount. You'll see their public profile (handle, display name, bio, country, task history) to help you decide.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ink/70">
            <li>One active offer per helper per task</li>
            <li>You cannot offer on your own tasks</li>
 <li>Blocked/suspended users cannot offer</li>
          </ul>
        </article>

        <article className="p-6 border border-stone rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-2xl font-bold">3</div>
            <h2 className="text-2xl font-heading font-semibold text-ink">Accept an Offer</h2>
          </div>
          <p className="text-ink/70">
            When you find the right helper, click <strong>Accept</strong>. The task status changes to "In Progress". The helper is notified and must <strong>Confirm</strong> to finalize the connection.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ink/70">
            <li>You can accept only one offer per helper slot</li>
            <li>Declined offers cannot be re-accepted</li>
            <li>You can still withdraw before they confirm</li>
          </ul>
        </article>

        <article className="p-6 border border-stone rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-2xl font-bold">4</div>
            <h2 className="text-2xl font-heading font-semibold text-ink">Helper Confirms & Shares Contacts</h2>
          </div>
          <p className="text-ink/70">
            The helper reviews your acceptance and chooses which contact methods to share with you (email, phone, Telegram, WhatsApp, Instagram, X, LinkedIn, or a custom URL). Only the methods they select are revealed.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ink/70">
            <li>Mutual consent required — no contacts shared until both sides agree</li>
            <li>Helper can withdraw instead of confirming</li>
            <li>Connection created with snapshot of chosen contacts</li>
          </ul>
        </article>

        <article className="p-6 border border-stone rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-2xl font-bold">5</div>
            <h2 className="text-2xl font-heading font-semibold text-ink">Connect & Complete</h2>
          </div>
          <p className="text-ink/70">
            You now have each other's chosen contact details. Take it from there — coordinate directly, do the work, and mark the task done when finished.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ink/70">
            <li>No in-app chat or payments — you arrange everything directly</li>
            <li>Task owner marks task Done when complete</li>
            <li>Both parties see the connection in their history</li>
          </ul>
        </article>

        <article className="p-6 border border-stone rounded-lg bg-pine/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-2xl font-bold">🔒</div>
            <h2 className="text-2xl font-heading font-semibold text-ink">Privacy by Design</h2>
          </div>
          <p className="text-ink/70">
            Your contact information is <strong>never public</strong>. It lives in a private table with owner-only access. Only when a connection is confirmed are the chosen methods copied to a <code>connection_shares</code> table visible only to the two parties. No emails, phones, or handles ever appear in search, feeds, or profiles.
          </p>
        </article>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-heading font-semibold text-ink mb-4">Ready to get started?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/tasks">
            <Button size="lg">Browse Tasks</Button>
          </Link>
          <Link href="/post">
            <Button variant="secondary" size="lg">Post a Task</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}