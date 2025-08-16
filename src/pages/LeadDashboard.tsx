import { useState } from 'react'
import type { Lead, LeadStatus, Opportunity } from '../types'
import { useLeads } from '../hooks/useLeads'
import { useOpportunities } from '../hooks/useOpportunities'
import Input from '../components/atoms/Input'
import Sidebar from '../components/organisms/Sidebar'
import LeadTable from '../components/organisms/LeadTable'
import OpportunitiesTable from '../components/organisms/OpportunitiesTable'
import LeadPanelLayout from '../components/templates/LeadPanelLayout'

function LeadDashboard() {
  const {
    leads,
    loading,
    error,
    searchTerm,
    statusFilter,
    sortBy,
    updateLead,
    removeLead,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
  } = useLeads()

  const {
    opportunities,
    loading: opportunitiesLoading,
    error: opportunitiesError,
    addOpportunity,
  } = useOpportunities()

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [currentView, setCurrentView] = useState<'leads' | 'opportunities'>('leads')


  const handleConvertToOpportunity = async (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>
  ) => {
    await addOpportunity({
      ...opportunityData,
      leadId: lead.id,
    })
    await removeLead(lead.id)
    setSelectedLead(null)
  }

  const handleCancel = () => {
    setSelectedLead(null)
  }

  if (loading || opportunitiesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || opportunitiesError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-700 font-medium">Error</div>
          <div className="text-red-600">{error || opportunitiesError}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Console</h1>
              <p className="text-gray-600 mt-1">Manage leads and convert them to opportunities</p>
            </div>

            {/* Navigation */}
            <div className="flex bg-white rounded-lg shadow-sm border p-1">
              <button
                onClick={() => setCurrentView('leads')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'leads'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setCurrentView('opportunities')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'opportunities'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Opportunities ({opportunities.length})
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {currentView === 'leads' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                    <dd className="text-lg font-medium text-gray-900">{leads.length}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Qualified Leads</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leads.filter(lead => lead.status === 'qualified').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Score</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leads.length > 0
                        ? Math.round(
                            leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length
                          )
                        : 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'leads' && (
          <>
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className=""></div>
                <Input
                  type="text"
                  placeholder="Search by name or company..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'score' | 'name' | 'company')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="score">Sort by Score</option>
                  <option value="name">Sort by Name</option>
                  <option value="company">Sort by Company</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <LeadTable
              leads={leads}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onLeadSelect={setSelectedLead}
            />
          </>
        )}

        {currentView === 'opportunities' && (
          <OpportunitiesTable opportunities={opportunities} />
        )}

        <Sidebar
          lead={selectedLead}
          onSave={updateLead}
          isOpen={!!selectedLead}
          onClose={handleCancel}
          onConvertToOpportunity={handleConvertToOpportunity}
        >
          <Sidebar.Body>
            <LeadPanelLayout
              lead={selectedLead}
              isOpen={!!selectedLead}
              onClose={handleCancel}
              onConvertToOpportunity={handleConvertToOpportunity}
            />
          </Sidebar.Body>
        </Sidebar>
      </div>
    </div>
  )
}

export default LeadDashboard
