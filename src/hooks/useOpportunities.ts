import { useState, useEffect } from 'react'
import type { Opportunity } from '../types'
import { useErrorHandler } from './useErrorHandler'
import { ERROR_CODES } from '../utils/error'

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const { error, executeWithErrorHandling } = useErrorHandler()

  useEffect(() => {
    const loadOpportunities = async () => {
      setLoading(true)
      
      const result = await executeWithErrorHandling(
        async () => {
          const savedOpportunities = localStorage.getItem('opportunities')
          return savedOpportunities ? JSON.parse(savedOpportunities) : []
        },
        ERROR_CODES.LOAD_FAILED,
        'opportunities'
      )

      if (result !== null) {
        setOpportunities(result)
      }
      setLoading(false)
    }

    loadOpportunities()
  }, [executeWithErrorHandling])

  const addOpportunity = async (opportunity: Omit<Opportunity, 'id'>) => {
    return await executeWithErrorHandling(
      async () => {
        const newId = Date.now()
        const newOpportunity: Opportunity = {
          ...opportunity,
          id: newId,
        }

        const updatedOpportunities = [...opportunities, newOpportunity]
        setOpportunities(updatedOpportunities)

        localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities))

        return newOpportunity
      },
      ERROR_CODES.SAVE_FAILED,
      'opportunity'
    )
  }

  const updateOpportunity = async (id: number, updates: Partial<Opportunity>) => {
    await executeWithErrorHandling(
      async () => {
        const updatedOpportunities = opportunities.map(opp =>
          opp.id === id ? { ...opp, ...updates } : opp
        )

        setOpportunities(updatedOpportunities)
        localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities))
      },
      ERROR_CODES.UPDATE_FAILED,
      'opportunity'
    )
  }

  return {
    opportunities,
    loading,
    error,
    addOpportunity,
    updateOpportunity,
  }
}
