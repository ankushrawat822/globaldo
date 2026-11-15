export default function GuidelinesPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-heading font-semibold text-pine mb-4">Community Guidelines</h1>
      <p className="text-sm text-ink/60 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">Our Mission</h2>
        <p className="text-ink/80">
          GlobalDo is a global public board where people post tasks they need help with, and others offer assistance. These guidelines exist to keep the platform safe, respectful, and useful for everyone.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">1. Be Respectful & Clear</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Communicate clearly in task descriptions and offer messages.</li>
          <li>Treat every user with courtesy, even when declining or withdrawing.</li>
          <li>No harassment, hate speech, or discriminatory language.</li>
          <li>Assume good intent; clarify misunderstandings politely.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">2. Protect Privacy — No Contact Info in Public</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Never include email, phone, social handles, or links in task titles, descriptions, or offer messages.</li>
          <li>Contact methods are only shared after mutual acceptance, and only the methods you explicitly choose.</li>
          <li>Our system automatically detects and blocks contact info in public fields — please don't try to circumvent it.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">3. Legal & Ethical Use</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>No illegal activities, fraud, scams, or facilitation of crimes.</li>
          <li>No adult/sexual content or services.</li>
          <li>No medical advice, therapy, or regulated professional services without proper licensing.</li>
          <li>No spam, mass-posting, or automated scraping.</li>
          <li>No impersonation or fake identities.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">4. Task Quality</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Describe the task accurately — what, where, when, and what compensation.</li>
          <li>Use appropriate categories and tags to help helpers find your task.</li>
          <li>Set realistic deadlines and compensation.</li>
          <li>Owners: Close or mark done when completed.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">5. Offers & Commitments</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Only offer on tasks you genuinely can and intend to complete.</li>
          <li>One active offer per task per user.</li>
          <li>You may withdraw before the owner accepts.</li>
          <li>If accepted, confirm promptly and share your chosen contact methods.</li>
          <li>Once confirmed, work out details directly with the other party.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">6. Safety & Meetings</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>For in-person tasks: Meet in public places, share your plans with someone you trust.</li>
          <li>Trust your instincts — if something feels off, decline or report it.</li>
          <li>GlobalDo does not verify user identities or backgrounds.</li>
          <li>No money should change hands through the platform (no escrow, no payments).</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">7. Reporting & Moderation</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Use the "Report" button on tasks for violations.</li>
          <li>Block users who make you uncomfortable (Settings → Blocked Users).</li>
          <li>Reports are reviewed by our admin team; actions may include hiding tasks or suspending users.</li>
          <li>False reports may result in action against the reporter.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-heading font-semibold text-ink">8. Consequences</h2>
        <p className="text-ink/80">
          Violations may result in: task removal, temporary suspension, permanent ban, or legal referral for illegal activity. We reserve the right to take action to protect the community.
        </p>
      </section>

      <p className="mt-8 text-center text-ink/60">
        Questions? Contact <a href="mailto:slave.container01@gmail.com" className="underline hover:text-pine">slave.container01@gmail.com</a>
      </p>
    </div>
  )
}