import React, { useState, useEffect } from 'react'
import type { Lead, LeadStatus, Opportunity } from '../types'

interface LeadDetailPanelProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: number, updates: Partial<Lead>) => Promise<void>
  onConvertToOpportunity: (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>
  ) => Promise<void>
}

export default function LeadDetailPanel({
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
  const [converting, setConverting] = useState(false)
  const [showConvertForm, setShowConvertForm] = useState(false)
  const [opportunityData, setOpportunityData] = useState({
    name: '',
    stage: 'qualification',
    amount: '',
    accountName: '',
  })

  useEffect(() => {
    if (lead) {
      setEditValues({
        status: lead.status,
        email: lead.email,
      })
      setOpportunityData({
        name: `${lead.name} - ${lead.company} Opportunity`,
        stage: 'qualification',
        amount: '',
        accountName: lead.company,
      })
      setErrors({})
      setEditingField(null)
      setShowConvertForm(false)
    }
  }, [lead])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSaveAll = async () => {
    if (!lead) return

    if (!validateEmail(editValues.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setSaving(true)
    setErrors({})

    try {
      const updates: Partial<Lead> = {}
      if (editValues.email !== lead.email) updates.email = editValues.email
      if (editValues.status !== lead.status) updates.status = editValues.status

      if (Object.keys(updates).length > 0) {
        await onSave(lead.id, updates)
      }
      setEditingField(null)
      onClose()
    } catch (_error) {
      setErrors({ email: 'Failed to save changes' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (lead) {
      setEditValues({
        status: lead.status,
        email: lead.email,
      })
    }
    setErrors({})
    setEditingField(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const hasChanges = lead && (editValues.email !== lead.email || editValues.status !== lead.status)

  const handleConvert = async () => {
    if (!lead) return

    setConverting(true)
    try {
      const amount = opportunityData.amount ? parseFloat(opportunityData.amount) : undefined
      await onConvertToOpportunity(lead, {
        name: opportunityData.name,
        stage: opportunityData.stage,
        amount,
        accountName: opportunityData.accountName,
      })
      onClose()
    } catch (_error) {
      setErrors({ email: 'Failed to convert lead to opportunity' })
    } finally {
      setConverting(false)
    }
  }

  if (!isOpen || !lead) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
            <button
              onClick={() => {
                handleCancel()
                onClose()
              }}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">{lead.name}</p>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                  {lead.company}
                </p>
              </div>

              {/* Email - Editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editingField === 'email' ? (
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={editValues.email}
                      onChange={e => setEditValues(prev => ({ ...prev, email: e.target.value }))}
                      onKeyDown={handleKeyDown}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
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

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">{lead.source}</p>
              </div>

              {/* Score */}
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

              {/* Status - Editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {editingField === 'status' ? (
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
                ) : (
                  <div
                    className="cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded border"
                    onClick={() => setEditingField('status')}
                  >
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : lead.status === 'qualified'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">(click to edit)</span>
                  </div>
                )}
              </div>

              {/* Convert to Opportunity Form */}
              {showConvertForm && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Convert to Opportunity</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opportunity Name
                      </label>
                      <input
                        type="text"
                        value={opportunityData.name}
                        onChange={e =>
                          setOpportunityData(prev => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter opportunity name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                      <select
                        value={opportunityData.stage}
                        onChange={e =>
                          setOpportunityData(prev => ({ ...prev, stage: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="qualification">Qualification</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="closed-won">Closed Won</option>
                        <option value="closed-lost">Closed Lost</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (Optional)
                      </label>
                      <input
                        type="number"
                        value={opportunityData.amount}
                        onChange={e =>
                          setOpportunityData(prev => ({ ...prev, amount: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={opportunityData.accountName}
                        onChange={e =>
                          setOpportunityData(prev => ({ ...prev, accountName: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter account name"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={handleConvert}
                        disabled={
                          converting || !opportunityData.name || !opportunityData.accountName
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {converting ? 'Converting...' : 'Create Opportunity'}
                      </button>
                      <button
                        onClick={() => setShowConvertForm(false)}
                        disabled={converting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving || !hasChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div>
                <button
                  onClick={() => setShowConvertForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Convert to Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
