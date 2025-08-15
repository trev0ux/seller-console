// hooks/useLeads.ts
import { useState, useEffect, useMemo } from 'react'
import type { Lead, LeadStatus } from '../types/index'
import leadsData from '../data/leads.json'

const simulateLatency = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface UseLeadsState {
  leads: Lead[]
  loading: boolean
  error: string | null
  searchTerm: string
  statusFilter: LeadStatus | 'all'
  sortBy: 'score' | 'name' | 'company'
}

export function useLeads() {
  const [state, setState] = useState<UseLeadsState>({
    leads: [],
    loading: true,
    error: null,
    searchTerm: '',
    statusFilter: 'all',
    sortBy: 'score',
  })

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        await simulateLatency()

        // Load from localStorage or use leads.json data
        const savedLeads = localStorage.getItem('leads')
        const leads = savedLeads ? JSON.parse(savedLeads) : leadsData

        setState(prev => ({ ...prev, leads, loading: false }))
      } catch (_error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load leads',
          loading: false,
        }))
      }
    }

    loadLeads()
  }, [])

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = state.leads

    // Search filter
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase()
      filtered = filtered.filter(
        lead => lead.name.toLowerCase().includes(term) || lead.company.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (state.statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === state.statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'score':
          return b.score - a.score
        case 'name':
          return a.name.localeCompare(b.name)
        case 'company':
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

    return filtered
  }, [state.leads, state.searchTerm, state.statusFilter, state.sortBy])

  const updateLead = async (id: number, updates: Partial<Lead>) => {
    try {
      await simulateLatency(200)

      setState(prev => {
        const updatedLeads = prev.leads.map(lead =>
          lead.id === id ? { ...lead, ...updates } : lead
        )

        // Save to localStorage
        localStorage.setItem('leads', JSON.stringify(updatedLeads))

        return { ...prev, leads: updatedLeads }
      })
    } catch (_error) {
      setState(prev => ({ ...prev, error: 'Failed to update lead' }))
    }
  }

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }))
  }

  const setStatusFilter = (status: LeadStatus | 'all') => {
    setState(prev => ({ ...prev, statusFilter: status }))
  }

  const setSortBy = (sort: 'score' | 'name' | 'company') => {
    setState(prev => ({ ...prev, sortBy: sort }))
  }

  const removeLead = async (id: number) => {
    try {
      await simulateLatency(200)

      setState(prev => {
        const updatedLeads = prev.leads.filter(lead => lead.id !== id)

        // Save to localStorage
        localStorage.setItem('leads', JSON.stringify(updatedLeads))

        return { ...prev, leads: updatedLeads }
      })
    } catch (_error) {
      setState(prev => ({ ...prev, error: 'Failed to remove lead' }))
    }
  }

  return {
    leads: filteredAndSortedLeads,
    loading: state.loading,
    error: state.error,
    searchTerm: state.searchTerm,
    statusFilter: state.statusFilter,
    sortBy: state.sortBy,
    updateLead,
    removeLead,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
  }
}
