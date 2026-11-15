'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const CONTACT_TYPES = [
  { value: 'email', label: 'Email', placeholder: 'you@example.com', icon: 'mail' },
  { value: 'phone', label: 'Phone', placeholder: '+1 555 123 4567', icon: 'phone' },
  { value: 'telegram', label: 'Telegram', placeholder: '@username', icon: 'send' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: 'wa.me/number', icon: 'message-circle' },
  { value: 'instagram', label: 'Instagram', placeholder: '@username', icon: 'instagram' },
  { value: 'x', label: 'X (Twitter)', placeholder: '@username', icon: 'x' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username', icon: 'linkedin' },
  { value: 'url', label: 'Other URL', placeholder: 'https://example.com', icon: 'link' },
]

interface ContactMethod {
  id?: string
  type: string
  value: string
}

interface ContactMethodsProps {
  methods: ContactMethod[]
  // eslint-disable-next-line no-unused-vars
  onChange: (methods: ContactMethod[]) => void
  disabled?: boolean
  showAdd?: boolean
}

export function ContactMethods({ methods, onChange, disabled = false, showAdd = true }: ContactMethodsProps) {
  const [newType, setNewType] = useState('email')
  const [newValue, setNewValue] = useState('')

  const handleAdd = () => {
    if (!newValue.trim()) return
    if (methods.some(m => m.type === newType && m.value === newValue)) return
    onChange([...methods, { type: newType, value: newValue.trim() }])
    setNewValue('')
  }

  const handleRemove = (index: number) => {
    onChange(methods.filter((_, i) => i !== index))
  }

  const selectedTypeInfo = CONTACT_TYPES.find(t => t.value === newType)

  return (
    <div className="space-y-4">
      {methods.map((method, index) => (
        <div key={index} className="flex items-center gap-2 p-3 border border-stone rounded-lg bg-white">
          <span className="px-2 py-1 text-xs rounded bg-pine/10 text-pine font-medium capitalize">
            {CONTACT_TYPES.find(t => t.value === method.type)?.label || method.type}
          </span>
          <Input
            value={method.value}
            onChange={(e) => {
              const updated = [...methods]
              updated[index] = { ...updated[index], value: e.target.value }
              onChange(updated)
            }}
            placeholder={selectedTypeInfo?.placeholder}
            disabled={disabled}
            className="flex-1"
          />
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="text-danger hover:bg-red-50"
              aria-label="Remove contact method"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}

      {showAdd && !disabled && (
        <div className="flex items-center gap-2 p-3 border border-stone rounded-lg bg-paper">
          <Select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-36"
          >
            {CONTACT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={selectedTypeInfo?.placeholder}
            className="flex-1"
          />
          <Button type="button" onClick={handleAdd} disabled={!newValue.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {methods.length === 0 && showAdd && !disabled && (
        <p className="text-sm text-ink/50 text-center">Add at least one contact method to share when connecting</p>
      )}
    </div>
  )
}

interface ContactMethodPickerProps {
  availableMethods: ContactMethod[]
  selectedIds: string[]
  // eslint-disable-next-line no-unused-vars
  onChange: (ids: string[]) => void
  disabled?: boolean
}

export function ContactMethodPicker({ availableMethods, selectedIds, onChange, disabled = false }: ContactMethodPickerProps) {
  const toggle = (id: string) => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id]
    )
  }

  return (
    <div className="space-y-2">
      {availableMethods.map((method) => (
        <label
          key={method.id || method.value}
          className={cn(
            'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
            selectedIds.includes(method.id || method.value)
              ? 'border-pine bg-pine/5'
              : 'border-stone hover:border-pine/50'
          )}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(method.id || method.value)}
            onChange={() => toggle(method.id || method.value)}
            disabled={disabled}
            className="w-4 h-4 text-pine border-stone rounded focus:ring-pine"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs rounded bg-pine/10 text-pine capitalize">
                {CONTACT_TYPES.find(t => t.value === method.type)?.label || method.type}
              </span>
              <span className="text-ink font-medium">{method.value}</span>
            </div>
          </div>
          {selectedIds.includes(method.id || method.value) && (
            <Check className="w-5 h-5 text-pine" />
          )}
        </label>
      ))}
    </div>
  )
}