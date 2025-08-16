import React, { useState, useEffect } from 'react'
import type { Lead, LeadStatus, Opportunity } from '../../types'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'

interface LeadDetailPanelProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onConvertToOpportunity: (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>
  ) => Promise<void>
}

export default function LeadPanelLayout({ lead, isOpen, onClose, onConvertToOpportunity }: LeadDetailPanelProps) {
  const [editingField, setEditingField] = useState<'status' | 'email' | null>(null)
  const [editValues, setEditValues] = useState({
    status: lead?.status || 'new',
    email: lead?.email || '',
  })
  const [errors, setErrors] = useState<{ email?: string }>({})
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

        {showConvertForm && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Convert to Opportunity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Name
                </label>
                <Input
                  type="text"
                  value={opportunityData.name}
                  onChange={event => setOpportunityData(prev => ({ ...prev, name: event }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter opportunity name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <Select
                  value={opportunityData.stage}
                  onChange={event => setOpportunityData(prev => ({ ...prev, stage: event }))}
                  options={[
                    { value: 'qualification', label: 'Qualification' },
                    { value: 'proposal', label: 'Proposal' },
                    { value: 'negotiation', label: 'Negotiation' },
                    { value: 'closed-won', label: 'Closed Won' },
                    { value: 'closed-lost', label: 'Closed Lost' },
                  ]}
                  placeholder="Filter by status"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (Optional)
                </label>
                <Input
                  type="number"
                  value={opportunityData.amount}
                  onChange={event => setOpportunityData(prev => ({ ...prev, amount: event }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min={0}
                  step={0.01}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <Input
                  type="text"
                  value={opportunityData.accountName}
                  onChange={event => setOpportunityData(prev => ({ ...prev, accountName: event }))}
                  placeholder="Enter account name"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={handleConvert}
                  variant="primary"
                  size="md"
                  disabled={converting || !opportunityData.name || !opportunityData.accountName}
                >
                  {converting ? 'Converting...' : 'Create Opportunity'}
                </Button>
                <Button
                  onClick={() => setShowConvertForm(false)}
                  disabled={converting}
                  variant="ghost"
                  size="md"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
