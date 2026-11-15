'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'

const CATEGORIES = [
  'Writing & translation',
  'Design & creative',
  'Tech & coding',
  'Tutoring & learning',
  'Errands & local help',
  'Home & repair',
  'Admin & research',
  'Health & wellness (non-medical)',
  'Events & community',
  'Other'
]
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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'deadline', label: 'Deadline soonest' },
]

const COMPENSATION_OPTIONS = [
  { value: 'none', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'swap', label: 'Skill swap' },
]

const LOCATION_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'in_person', label: 'In-person' },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'closed', label: 'Closed' },
  { value: 'expired', label: 'Expired' },
]

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getParam = (key: string) => searchParams.get(key) || ''
  const hasFilters = ['category', 'country', 'compensation', 'location', 'status', 'sort', 'q'].some(k => searchParams.has(k))

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="border border-stone rounded-lg p-4 space-y-4 bg-white">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <Input
          placeholder="Search tasks..."
          value={getParam('q')}
          onChange={(e) => {
            const value = e.target.value
            if (value) {
              updateParams({ q: value })
            } else {
              updateParams({ q: null })
            }
          }}
          className="pl-10"
        />
      </div>

      {/* Primary filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          value={getParam('category')}
          onChange={(e) => updateParams({ category: e.target.value || null })}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>

        <Select
          value={getParam('country')}
          onChange={(e) => updateParams({ country: e.target.value || null })}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </Select>

        <Select
          value={getParam('compensation')}
          onChange={(e) => updateParams({ compensation: e.target.value || null })}
        >
          <option value="">All compensation</option>
          {COMPENSATION_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>

        <Select
          value={getParam('location')}
          onChange={(e) => updateParams({ location: e.target.value || null })}
        >
          <option value="">All locations</option>
          {LOCATION_OPTIONS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </Select>
      </div>

      {/* Secondary filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          value={getParam('status') || 'open'}
          onChange={(e) => updateParams({ status: e.target.value || null })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>

        <Select
          value={getParam('sort') || 'newest'}
          onChange={(e) => updateParams({ sort: e.target.value || null })}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>

        <div className="sm:col-span-2" />
      </div>

      {/* Active filters summary */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone">
          <span className="text-sm text-ink/60">Active filters:</span>
          {[
            ['category', 'Category'],
            ['country', 'Country'],
            ['compensation', 'Compensation'],
            ['location', 'Location'],
            ['status', 'Status'],
            ['sort', 'Sort'],
            ['q', 'Search'],
          ].map(([key, label]) => {
            const value = getParam(key)
            if (!value) return null
            return (
              <span key={key} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-pine/10 text-pine rounded-full">
                {label}: {key === 'q' ? `"${value}"` : value}
                <button
                  type="button"
                  onClick={() => updateParams({ [key]: null })}
                  className="ml-1 hover:text-pine/70"
                  aria-label={`Remove ${label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}