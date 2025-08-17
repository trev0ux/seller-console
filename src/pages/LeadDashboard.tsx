import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lead, Opportunity } from '../types'
import { useLeads } from '../hooks/useLeads'
import { useOpportunities } from '../hooks/useOpportunities'
import Sidebar from '../components/organisms/Sidebar'
import LeadTable from '../components/organisms/LeadTable'
import LeadFilters from '../components/molecules/LeadFilters'
import Stats from '../components/molecules/Stats'
import Pagination from '../components/molecules/Pagination/Pagination'
import ConvertToOpportunityModal from '../components/molecules/ConvertToOpportunityModal/ConvertToOpportunityModal'
import type { StatItem } from '../components/molecules/Stats'
import LeadPanelLayout from '../components/templates/LeadPanelLayout'

function LeadDashboard() {
  const {
    leads,
    allLeads,
    loading,
    error,
    searchTerm,
    statusFilter,
    sortBy,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    updateLead,
    removeLead,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    setCurrentPage,
    setItemsPerPage,
  } = useLeads()

  const {
    opportunities,
    loading: opportunitiesLoading,
    error: opportunitiesError,
    addOpportunity,
  } = useOpportunities()

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [convertModalOpen, setConvertModalOpen] = useState(false)
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null)

  const leadsStats: StatItem[] = [
    {
      label: 'Total Leads',
      value: allLeads.length,
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Qualified Leads',
      value: allLeads.filter(lead => lead.status === 'qualified').length,
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Avg Score',
      value:
        allLeads.length > 0
          ? Math.round(allLeads.reduce((sum, lead) => sum + lead.score, 0) / allLeads.length)
          : 0,
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
    setConvertModalOpen(false)
    setLeadToConvert(null)
  }

  const handleOpenConvertModal = (lead: Lead) => {
    setLeadToConvert(lead)
    setConvertModalOpen(true)
    setSelectedLead(null)
  }

  const handleCloseConvertModal = () => {
    setConvertModalOpen(false)
    setLeadToConvert(null)
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and track your sales leads</p>
            </div>
            <Link
              to="/opportunities"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              View Opportunities
            </Link>
          </div>
        </div>

        <Stats stats={leadsStats} />

        <LeadFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onSortByChange={setSortBy}
        />

        <LeadTable
          leads={leads}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onLeadSelect={setSelectedLead}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <Sidebar
          lead={selectedLead}
          onSave={updateLead}
          isOpen={!!selectedLead}
          onClose={handleCancel}
          onConvertToOpportunity={handleOpenConvertModal}
        >
          <Sidebar.Body>
            <LeadPanelLayout
              lead={selectedLead}
              isOpen={!!selectedLead}
              onClose={handleCancel}
              onSave={updateLead}
              onConvertToOpportunity={handleOpenConvertModal}
            />
          </Sidebar.Body>
        </Sidebar>

        <ConvertToOpportunityModal
          lead={leadToConvert}
          isOpen={convertModalOpen}
          onClose={handleCloseConvertModal}
          onConvert={handleConvertToOpportunity}
        />
      </div>
    </div>
  )
}

export default LeadDashboard
