import { useState, useEffect, useMemo } from 'react'
import type { Lead, LeadStatus } from '../types/index'
import leadsData from '../data/leads.json'
import { useErrorHandler } from './useErrorHandler'
import { ERROR_CODES } from '../utils/error'

const simulateLatency = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface UseLeadsState {
  leads: Lead[]
  loading: boolean
  searchTerm: string
  statusFilter: LeadStatus | 'all'
  sortBy: 'score' | 'name' | 'company'
  currentPage: number
  itemsPerPage: number
}

const getInitialFilters = () => {
  try {
    const savedFilters = localStorage.getItem('leadFilters')
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters)
      return {
        searchTerm: parsed.searchTerm || '',
        statusFilter: parsed.statusFilter || 'all',
        sortBy: parsed.sortBy || 'score',
        currentPage: parsed.currentPage || 1,
        itemsPerPage: parsed.itemsPerPage || 10,
      }
    }
  } catch (error) {
    console.warn('Failed to load saved filters:', error)
  }
  return {
    searchTerm: '',
    statusFilter: 'all' as LeadStatus | 'all',
    sortBy: 'score' as 'score' | 'name' | 'company',
    currentPage: 1,
    itemsPerPage: 10,
  }
}

export function useLeads() {
  const { error, executeWithErrorHandling } = useErrorHandler()
  const initialFilters = getInitialFilters()
  const [state, setState] = useState<UseLeadsState>({
    leads: [],
    loading: true,
    ...initialFilters,
  })

  useEffect(() => {
    const loadLeads = async () => {
      setState(prev => ({ ...prev, loading: true }))
      
      const result = await executeWithErrorHandling(
        async () => {
          await simulateLatency()
          const savedLeads = localStorage.getItem('leads')
          return savedLeads ? JSON.parse(savedLeads) : leadsData
        },
        ERROR_CODES.LOAD_FAILED,
        'leads'
      )

      if (result !== null) {
        setState(prev => ({ ...prev, leads: result, loading: false }))
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    loadLeads()
  }, [executeWithErrorHandling])

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = state.leads

    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase()
      filtered = filtered.filter(
        lead => lead.name.toLowerCase().includes(term) || lead.company.toLowerCase().includes(term)
      )
    }

    if (state.statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === state.statusFilter)
    }

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

  const paginatedLeads = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage
    const endIndex = startIndex + state.itemsPerPage
    return filteredAndSortedLeads.slice(startIndex, endIndex)
  }, [filteredAndSortedLeads, state.currentPage, state.itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedLeads.length / state.itemsPerPage)

  const updateLead = async (id: number, updates: Partial<Lead>) => {
    await executeWithErrorHandling(
      async () => {
        await simulateLatency(200)

        setState(prev => {
          const updatedLeads = prev.leads.map(lead =>
            lead.id === id ? { ...lead, ...updates } : lead
          )

          localStorage.setItem('leads', JSON.stringify(updatedLeads))

          return { ...prev, leads: updatedLeads }
        })
      },
      ERROR_CODES.UPDATE_FAILED,
      'lead'
    )
  }

  const saveFiltersToStorage = (filters: {
    searchTerm: string
    statusFilter: LeadStatus | 'all'
    sortBy: 'score' | 'name' | 'company'
    currentPage: number
    itemsPerPage: number
  }) => {
    try {
      localStorage.setItem('leadFilters', JSON.stringify(filters))
    } catch (error) {
      console.warn('Failed to save filters to localStorage:', error)
    }
  }

  const setSearchTerm = (term: string) => {
    setState(prev => {
      const newState = { ...prev, searchTerm: term, currentPage: 1 }
      saveFiltersToStorage({
        searchTerm: term,
        statusFilter: prev.statusFilter,
        sortBy: prev.sortBy,
        currentPage: 1,
        itemsPerPage: prev.itemsPerPage,
      })
      return newState
    })
  }

  const setStatusFilter = (status: LeadStatus | 'all') => {
    setState(prev => {
      const newState = { ...prev, statusFilter: status, currentPage: 1 }
      saveFiltersToStorage({
        searchTerm: prev.searchTerm,
        statusFilter: status,
        sortBy: prev.sortBy,
        currentPage: 1,
        itemsPerPage: prev.itemsPerPage,
      })
      return newState
    })
  }

  const setSortBy = (sort: 'score' | 'name' | 'company') => {
    setState(prev => {
      const newState = { ...prev, sortBy: sort }
      saveFiltersToStorage({
        searchTerm: prev.searchTerm,
        statusFilter: prev.statusFilter,
        sortBy: sort,
        currentPage: prev.currentPage,
        itemsPerPage: prev.itemsPerPage,
      })
      return newState
    })
  }

  const setCurrentPage = (page: number) => {
    setState(prev => {
      const newState = { ...prev, currentPage: page }
      saveFiltersToStorage({
        searchTerm: prev.searchTerm,
        statusFilter: prev.statusFilter,
        sortBy: prev.sortBy,
        currentPage: page,
        itemsPerPage: prev.itemsPerPage,
      })
      return newState
    })
  }

  const setItemsPerPage = (items: number) => {
    setState(prev => {
      const newState = { ...prev, itemsPerPage: items, currentPage: 1 }
      saveFiltersToStorage({
        searchTerm: prev.searchTerm,
        statusFilter: prev.statusFilter,
        sortBy: prev.sortBy,
        currentPage: 1,
        itemsPerPage: items,
      })
      return newState
    })
  }

  const removeLead = async (id: number) => {
    await executeWithErrorHandling(
      async () => {
        await simulateLatency(200)

        setState(prev => {
          const updatedLeads = prev.leads.filter(lead => lead.id !== id)

          localStorage.setItem('leads', JSON.stringify(updatedLeads))

          return { ...prev, leads: updatedLeads }
        })
      },
      ERROR_CODES.DELETE_FAILED,
      'lead'
    )
  }

  return {
    leads: paginatedLeads,
    allLeads: filteredAndSortedLeads,
    loading: state.loading,
    error,
    searchTerm: state.searchTerm,
    statusFilter: state.statusFilter,
    sortBy: state.sortBy,
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    totalPages,
    totalItems: filteredAndSortedLeads.length,
    updateLead,
    removeLead,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    setCurrentPage,
    setItemsPerPage,
  }
}
