import { Link } from 'react-router-dom'
import { useOpportunities } from '../hooks/useOpportunities'
import OpportunitiesTable from '../components/organisms/OpportunitiesTable'
import ErrorDisplay from '../components/atoms/ErrorDisplay/ErrorDisplay'
import Stats from '../components/molecules/Stats'
import type { StatItem } from '../components/molecules/Stats'

function OpportunitiesDashboard() {
  const {
    opportunities,
    loading,
    error,
  } = useOpportunities()

  const opportunitiesStats: StatItem[] = [
    {
      label: 'Total Opportunities',
      value: opportunities.length,
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: 'Active Opportunities',
      value: opportunities.filter(opp => opp.stage !== 'closed-lost' && opp.stage !== 'closed-won').length,
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      label: 'Total Value',
      value: opportunities.reduce((sum, opp) => sum + opp.value, 0),
      color: 'yellow',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorDisplay 
          error={error} 
          className="max-w-md"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Opportunities Dashboard</h1>
              <p className="text-gray-600 mt-2">Track and manage your sales opportunities</p>
            </div>
            <Link
              to="/"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              View Leads
            </Link>
          </div>
        </div>

        <Stats stats={opportunitiesStats} />

        <OpportunitiesTable opportunities={opportunities} />
      </div>
    </div>
  )
}

export default OpportunitiesDashboard
