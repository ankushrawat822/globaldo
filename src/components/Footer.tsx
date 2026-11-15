import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone bg-white py-8 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-heading font-semibold text-pine mb-4">
              GlobalDo
            </h3>
            <p className="text-sm text-ink/70">
              A global public board of to-dos. People post what they need done; others offer to help.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-ink/70 hover:text-pine">
                  Tasks Feed
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-ink/70 hover:text-pine">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/post" className="text-ink/70 hover:text-pine">
                  Post a Task
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-ink/70 hover:text-pine">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-ink/70 hover:text-pine">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-ink/70 hover:text-pine">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:slave.container01@gmail.com" className="text-ink/70 hover:text-pine">
                  Report Issues
                </a>
              </li>
              <li>
                <a href="mailto:slave.container01@gmail.com" className="text-ink/70 hover:text-pine">
                  Admin Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone pt-6 text-center text-sm text-ink/60">
          <p>© {new Date().getFullYear()} GlobalDo. All rights reserved. Built with privacy & security in mind.</p>
        </div>
      </div>
    </footer>
  )
}