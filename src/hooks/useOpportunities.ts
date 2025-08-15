import { useState, useEffect } from 'react'
import type { Opportunity } from '../types'

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true)
        setError(null)

        const savedOpportunities = localStorage.getItem('opportunities')
        const data = savedOpportunities ? JSON.parse(savedOpportunities) : []

        setOpportunities(data)
      } catch (_error) {
        setError('Failed to load opportunities')
      } finally {
        setLoading(false)
      }
    }

    loadOpportunities()
  }, [])

  const addOpportunity = async (opportunity: Omit<Opportunity, 'id'>) => {
    try {
      const newId = Date.now()
      const newOpportunity: Opportunity = {
        ...opportunity,
        id: newId,
      }

      const updatedOpportunities = [...opportunities, newOpportunity]
      setOpportunities(updatedOpportunities)

      localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities))

      return newOpportunity
    } catch (error) {
      setError('Failed to create opportunity')
      throw error
    }
  }

  const updateOpportunity = async (id: number, updates: Partial<Opportunity>) => {
    try {
      const updatedOpportunities = opportunities.map(opp =>
        opp.id === id ? { ...opp, ...updates } : opp
      )

      setOpportunities(updatedOpportunities)
      localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities))
    } catch (error) {
      setError('Failed to update opportunity')
      throw error
    }
  }

  return {
    opportunities,
    loading,
    error,
    addOpportunity,
    updateOpportunity,
  }
}
