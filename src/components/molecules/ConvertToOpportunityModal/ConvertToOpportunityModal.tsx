import React, { useState, useEffect } from 'react'
import type { Lead, Opportunity } from '../../../types'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Select from '../../atoms/Select'

interface ConvertToOpportunityModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onConvert: (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>
  ) => Promise<void>
}

export default function ConvertToOpportunityModal({
  lead,
  isOpen,
  onClose,
  onConvert,
}: ConvertToOpportunityModalProps) {
  const [converting, setConverting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [opportunityData, setOpportunityData] = useState({
    name: '',
    stage: 'qualification',
    amount: '',
    accountName: '',
  })

  useEffect(() => {
    if (lead) {
      setOpportunityData({
        name: `${lead.name} - ${lead.company} Opportunity`,
        stage: 'qualification',
        amount: '',
        accountName: lead.company,
      })
      setErrors({})
    }
  }, [lead])

  const handleClose = () => {
    setErrors({})
    setConverting(false)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!opportunityData.name.trim()) {
      newErrors.name = 'Opportunity name is required'
    }
    if (!opportunityData.accountName.trim()) {
      newErrors.accountName = 'Account name is required'
    }
    if (opportunityData.amount && isNaN(Number(opportunityData.amount))) {
      newErrors.amount = 'Amount must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConvert = async () => {
    if (!lead || !validateForm()) return

    setConverting(true)
    try {
      const amount = opportunityData.amount ? parseFloat(opportunityData.amount) : undefined
      await onConvert(lead, {
        name: opportunityData.name,
        stage: opportunityData.stage,
        amount,
        accountName: opportunityData.accountName,
      })
      handleClose()
    } catch (error) {
      setErrors({ general: 'Failed to convert lead to opportunity' })
    } finally {
      setConverting(false)
    }
  }

  if (!isOpen || !lead) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Convert Lead to Opportunity
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-900">
              <strong>Lead:</strong> {lead.name} ({lead.company})
            </div>
            <div className="text-sm text-blue-700">
              Score: {lead.score} | Status: {lead.status}
            </div>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opportunity Name *
              </label>
              <Input
                type="text"
                value={opportunityData.name}
                onChange={(value) => setOpportunityData(prev => ({ ...prev, name: value }))}
                onKeyDown={handleKeyDown}
                placeholder="Enter opportunity name"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <Select
                value={opportunityData.stage}
                onChange={(value) => setOpportunityData(prev => ({ ...prev, stage: value }))}
                options={[
                  { value: 'qualification', label: 'Qualification' },
                  { value: 'proposal', label: 'Proposal' },
                  { value: 'negotiation', label: 'Negotiation' },
                  { value: 'closed-won', label: 'Closed Won' },
                  { value: 'closed-lost', label: 'Closed Lost' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opportunity Amount
              </label>
              <Input
                type="number"
                value={opportunityData.amount}
                onChange={(value) => setOpportunityData(prev => ({ ...prev, amount: value }))}
                onKeyDown={handleKeyDown}
                placeholder="Enter opportunity amount"
                error={errors.amount}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name *
              </label>
              <Input
                type="text"
                value={opportunityData.accountName}
                onChange={(value) => setOpportunityData(prev => ({ ...prev, accountName: value }))}
                onKeyDown={handleKeyDown}
                placeholder="Enter account name"
                error={errors.accountName}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={handleClose}
              variant="ghost"
              size="md"
              disabled={converting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConvert}
              variant="primary"
              size="md"
              disabled={converting || !opportunityData.name || !opportunityData.accountName}
              loading={converting}
            >
              {converting ? 'Converting...' : 'Create Opportunity'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}