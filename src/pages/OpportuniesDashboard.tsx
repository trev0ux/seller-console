import { Link } from 'react-router-dom'
import { useOpportunities } from '../hooks/useOpportunities'
import OpportunitiesTable from '../components/organisms/OpportunitiesTable'
import ErrorDisplay from '../components/atoms/ErrorDisplay/ErrorDisplay'
import Stats from '../components/molecules/Stats/Stats'
import type { StatItem } from '../components/molecules/Stats/Stats'
import { BarChartIcon, DollarSignIcon, TrendingUpIcon } from '../components/atoms/Icon'
import Loading from '../components/atoms/Loading'

function OpportunitiesDashboard() {
  const { opportunities, loading, error } = useOpportunities()

  const opportunitiesStats: StatItem[] = [
    {
      label: 'Total Opportunities',
      value: opportunities.length,
      color: 'blue',
      icon: <BarChartIcon />,
    },
    {
      label: 'Active Opportunities',
      value: opportunities.filter(opp => opp.stage !== 'closed-lost' && opp.stage !== 'closed-won')
        .length,
      color: 'green',
      icon: <TrendingUpIcon />,
    },
    {
      label: 'Total Value',
      value: opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0),
      color: 'yellow',
      icon: <DollarSignIcon />,
    },
  ]

  if (loading) {
    return <Loading fullScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorDisplay error={error} className="max-w-md" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex-col gap-4 lg:flex-row flex items-start lg:items-center justify-between">
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
  )
}

export default OpportunitiesDashboard
