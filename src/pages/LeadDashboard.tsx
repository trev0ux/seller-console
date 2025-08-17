import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lead, Opportunity } from '../types'
import { useLeads } from '../hooks/useLeads'
import { useOpportunities } from '../hooks/useOpportunities'
import Sidebar from '../components/organisms/Sidebar'
import LeadTable from '../components/organisms/LeadTable'
import LeadFilters from '../components/molecules/LeadFilters/LeadFilters'
import Stats from '../components/molecules/Stats/Stats'
import Pagination from '../components/molecules/Pagination/Pagination'
import ConvertToOpportunityModal from '../components/molecules/ConvertToOpportunityModal/ConvertToOpportunityModal'
import type { StatItem } from '../components/molecules/Stats/Stats'
import LeadPanelLayout from '../components/templates/LeadPanelLayout'
import { CheckCircleIcon, DollarSignIcon, UsersIcon } from '../components/atoms/Icon'
import Loading from '../components/atoms/Loading'

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
      icon: <UsersIcon />,
    },
    {
      label: 'Qualified Leads',
      value: allLeads.filter(lead => lead.status === 'qualified').length,
      color: 'green',
      icon: <CheckCircleIcon />,
    },
    {
      label: 'Avg Score',
      value:
        allLeads.length > 0
          ? Math.round(allLeads.reduce((sum, lead) => sum + lead.score, 0) / allLeads.length)
          : 0,
      color: 'yellow',
      icon: <DollarSignIcon />,
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
    return <Loading fullScreen />
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
          <div className="flex-col gap-4 lg:flex-row flex items-start lg:items-center justify-between">
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
