import React, { useState, useEffect } from 'react'
import type { Lead, LeadStatus, Opportunity } from '../../types'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'

interface LeadDetailPanelProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onSave?: (id: number, updates: Partial<Lead>) => Promise<void>
  onConvertToOpportunity: (lead: Lead) => void
}

export default function LeadPanelLayout({
  lead,
  isOpen,
  onClose,
  onSave,
  onConvertToOpportunity,
}: LeadDetailPanelProps) {
  const [editingField, setEditingField] = useState<'status' | 'email' | null>(null)
  const [editValues, setEditValues] = useState({
    status: lead?.status || 'new',
    email: lead?.email || '',
  })
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (lead) {
      setEditValues({
        status: lead.status,
        email: lead.email,
      })
      setErrors({})
      setEditingField(null)
    }
  }, [lead, lead?.id, lead?.status, lead?.email])

  const handleCancel = () => {
    if (lead) {
      setEditValues({
        status: lead.status,
        email: lead.email,
      })
    }
    setErrors({})
    setEditingField(null)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleConvert = () => {
    if (!lead) return
    onConvertToOpportunity(lead)
  }

  const hasChanges = lead
    ? editValues.status !== lead.status || editValues.email !== lead.email
    : false

  const handleSaveAll = async () => {
    if (!onSave || !hasChanges || !lead) return

    setSaving(true)
    try {
      const updates: Partial<Lead> = {}
      if (editValues.status !== lead.status) updates.status = editValues.status
      if (editValues.email !== lead.email) updates.email = editValues.email

      await onSave(lead.id, updates)
      onClose()
    } catch (error) {
      console.error('Failed to save changes:', error)
      setErrors({ email: 'Failed to save changes' })
    } finally {
      setSaving(false)
    }
  }


  if (!isOpen || !lead) return null

  return (
    <>
      <section className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">{lead.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">{lead.company}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          {editingField === 'email' ? (
            <div className="space-y-2">
              <Input
                type="email"
                value={editValues.email}
                onChange={event => setEditValues(prev => ({ ...prev, email: event }))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
          ) : (
            <div
              className="text-sm text-gray-900 bg-gray-50 p-2 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setEditingField('email')}
            >
              {lead.email}
              <span className="ml-2 text-xs text-gray-500">(click to edit)</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">{lead.source}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
          <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded border">
            <span className="text-lg font-bold text-gray-900">{lead.score}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="space-y-2">
            <select
              value={editValues.status}
              onChange={e =>
                setEditValues(prev => ({ ...prev, status: e.target.value as LeadStatus }))
              }
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

      </section>

      <footer className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between">
          <div className="flex items-center flex-col lg:flex-row gap-4 lg:gap-3 ">
            <Button
              variant="ghost"
              disabled={saving}
              size="md"
              className="lg:w-auto w-full"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {onSave && (
              <Button
                variant="primary"
                size="md"
                className="lg:w-auto w-full"
                disabled={saving || !hasChanges}
                onClick={handleSaveAll}
                loading={saving}
              >
                Save Changes
              </Button>
            )}
          </div>
          <Button variant="ghost" size="md" onClick={handleConvert}>
            Convert to Opportunity
          </Button>
        </div>
      </footer>
    </>
  )
}
