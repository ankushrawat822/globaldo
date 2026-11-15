import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-heading font-semibold text-pine mb-4">Terms of Service</h1>
      <p className="text-sm text-ink/60 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">1. Acceptance of Terms</h2>
        <p className="text-ink/80">
          By accessing or using GlobalDo ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not use the Platform.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">2. Description of Service</h2>
        <p className="text-ink/80">
          GlobalDo is a public task board where users ("Owners") post tasks they need help with, and other users ("Helpers") offer to assist. The Platform facilitates the connection but is not a party to any agreement between Owner and Helper.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">3. User Accounts</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>You must provide accurate information during registration.</li>
          <li>You are responsible for maintaining the security of your account.</li>
          <li>You must be at least 18 years old to use the Platform.</li>
          <li>One account per person. Duplicate accounts may be suspended.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">4. Acceptable Use</h2>
        <p className="text-ink/80">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Post illegal, harassing, hateful, or fraudulent content.</li>
          <li>Include contact information (email, phone, social handles, links) in public task fields.</li>
          <li>Impersonate another person or entity.</li>
          <li>Spam, scrape, or automate access to the Platform.</li>
          <li>Attempt to circumvent security measures or access controls.</li>
          <li>Use the Platform for any unlawful purpose.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">5. Tasks and Offers</h2>
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>Owners: You are responsible for the accuracy of your task descriptions.</li>
          <li>Helpers: Offers represent genuine intent to assist.</li>
          <li>Either party may withdraw before mutual confirmation.</li>
          <li>Contact details are revealed only after Owner accepts and Helper confirms.</li>
          <li>GlobalDo does not guarantee task completion, quality, or payment.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">6. Privacy and Contact Information</h2>
        <p className="text-ink/80">
          Your contact methods (email, phone, social handles) are private. They are only shared with the counterparty after mutual acceptance and confirmation, and only the specific methods you choose to share. See our <Link href="/privacy" className="underline hover:text-pine">Privacy Policy</Link> for details.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">7. Disclaimers</h2>
        <p className="text-ink/80">
          THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. GLOBALDO DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS. YOU USE THE PLATFORM AT YOUR OWN RISK.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">8. Limitation of Liability</h2>
        <p className="text-ink/80">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, GLOBALDO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL ARISING FROM YOUR USE OF THE PLATFORM.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">9. Termination</h2>
        <p className="text-ink/80">
          We may suspend or terminate your account for violations of these Terms. You may delete your account at any time via Settings. Upon termination, your data will be permanently removed per our data deletion policy.
        </p>
      </section>

      <section className="space-y-6 mb-8">
        <h2 className="text-xl font-heading font-semibold text-ink">10. Governing Law</h2>
        <p className="text-ink/80">
          These Terms are governed by the laws of the jurisdiction where GlobalDo operates, without regard to conflict of law principles.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-heading font-semibold text-ink">11. Changes to Terms</h2>
        <p className="text-ink/80">
          We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <Link href="/privacy" className="text-pine hover:underline mt-8 inline-block">
        Read our Privacy Policy →
      </Link>
    </div>
  )
}