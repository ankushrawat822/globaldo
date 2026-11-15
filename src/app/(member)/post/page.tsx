'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Loader2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { createTask } from '@/server/actions/tasks'

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

const CURRENCIES = ['USD', 'EUR', 'GBP', 'KRW', 'CAD', 'AUD', 'JPY', 'INR', 'BRL']

export default function PostTaskPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [locationMode, setLocationMode] = useState<'remote' | 'in_person'>('remote')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('US')
  const [compensationType, setCompensationType] = useState<'none' | 'paid' | 'swap'>('none')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [deadline, setDeadline] = useState('')
  const [helpersNeeded, setHelpersNeeded] = useState(1)

  const [posting, setPosting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPosting(true)
    setMessage(null)

    if (compensationType === 'paid' && (!amount || parseFloat(amount) <= 0)) {
      setMessage({ type: 'error', text: 'Paid tasks need a positive amount' })
      setPosting(false)
      return
    }

    if (locationMode === 'in_person' && !city.trim()) {
      setMessage({ type: 'error', text: 'In-person tasks need a city' })
      setPosting(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('tags', JSON.stringify(tags))
    formData.append('location_mode', locationMode)
    formData.append('city', city)
    formData.append('country', country)
    formData.append('compensation_type', compensationType)
    formData.append('amount', amount)
    formData.append('currency', currency)
    formData.append('deadline', deadline ? new Date(deadline).toISOString() : '')
    formData.append('helpers_needed', String(helpersNeeded))

    const result = await createTask(formData)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
      setPosting(false)
    } else if (result?.taskId) {
      router.push(`/tasks/${result.taskId}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-semibold text-pine mb-2">Post a task</h1>
        <p className="text-ink/70">Describe what you need done. Others can offer to help.</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          } flex items-center gap-2`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink mb-1">
            Title <span className="text-danger">*</span>
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need done?"
            required
            maxLength={120}
            disabled={posting}
          />
          <p className="text-sm text-ink/60 mt-1 text-right">{title.length}/120</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink mb-1">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about the task..."
            required
            maxLength={2000}
            rows={6}
            disabled={posting}
            className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-pine resize-none"
          />
          <p className="text-sm text-ink/60 mt-1 text-right">{description.length}/2000</p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-ink mb-1">
            Category <span className="text-danger">*</span>
          </label>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={posting}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-ink mb-1">
            Tags (max 5)
          </label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pine/10 text-pine text-sm">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-pine/70" aria-label={`Remove ${tag}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder="Add a tag and press Enter"
              disabled={posting || tags.length >= 5}
            />
            <Button type="button" onClick={addTag} variant="secondary" disabled={posting || tags.length >= 5 || !tagInput.trim()}>
              Add
            </Button>
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-2">
            Location <span className="text-danger">*</span>
          </span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="locationMode"
                value="remote"
                checked={locationMode === 'remote'}
                onChange={() => setLocationMode('remote')}
                disabled={posting}
              />
              <span>Remote</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="locationMode"
                value="in_person"
                checked={locationMode === 'in_person'}
                onChange={() => setLocationMode('in_person')}
                disabled={posting}
              />
              <span>In-person</span>
            </label>
          </div>
        </div>

        {locationMode === 'in_person' && (
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-ink mb-1">
              City <span className="text-danger">*</span>
            </label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Seoul"
              required
              disabled={posting}
            />
          </div>
        )}

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-ink mb-1">
            Country <span className="text-danger">*</span>
          </label>
          <Select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={posting}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="compensationType" className="block text-sm font-medium text-ink mb-1">
            Compensation <span className="text-danger">*</span>
          </label>
          <Select
            id="compensationType"
            value={compensationType}
            onChange={(e) => setCompensationType(e.target.value as 'none' | 'paid' | 'swap')}
            disabled={posting}
          >
            <option value="none">Free</option>
            <option value="paid">Paid</option>
            <option value="swap">Skill swap</option>
          </Select>
        </div>

        {compensationType === 'paid' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-ink mb-1">
                Amount <span className="text-danger">*</span>
              </label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50"
                required
                disabled={posting}
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-ink mb-1">
                Currency
              </label>
              <Select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={posting}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-ink mb-1">
            Deadline (optional)
          </label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            disabled={posting}
          />
        </div>

        <div>
          <label htmlFor="helpersNeeded" className="block text-sm font-medium text-ink mb-1">
            Helpers needed
          </label>
          <Select
            id="helpersNeeded"
            value={String(helpersNeeded)}
            onChange={(e) => setHelpersNeeded(Number(e.target.value))}
            disabled={posting}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={posting}>
          {posting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Post Task'}
        </Button>
      </form>
    </div>
  )
}