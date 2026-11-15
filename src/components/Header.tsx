'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'How it works' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ]

  return (
    <header className="border-b border-stone bg-white sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-heading font-semibold text-pine">
            GlobalDo
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${
                  pathname === item.href
                    ? 'text-pine font-medium'
                    : 'text-ink hover:text-pine'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link href="/my/tasks">
                  <Button variant="ghost" size="sm">
                    My Tasks
                  </Button>
                </Link>
                <Link href="/my/offers">
                  <Button variant="ghost" size="sm">
                    My Offers
                  </Button>
                </Link>
                <Link href="/my/connections">
                  <Button variant="ghost" size="sm">
                    Connections
                  </Button>
                </Link>
                <Link href="/post">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Task
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    Settings
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}