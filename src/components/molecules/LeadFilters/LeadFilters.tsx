import type { LeadStatus } from '../../../types'
import Input from '../../atoms/Input'
import { SearchIcon } from '../../atoms/Icon/icons/SearchIcon'

interface LeadFiltersProps {
  searchTerm: string
  statusFilter: LeadStatus | 'all'
  sortBy: 'score' | 'name' | 'company'
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: LeadStatus | 'all') => void
  onSortByChange: (value: 'score' | 'name' | 'company') => void
}

export default function LeadFilters({
  searchTerm,
  statusFilter,
  sortBy,
  onSearchChange,
  onStatusFilterChange,
  onSortByChange,
}: LeadFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center relative w-full">
          <Input
            type="text"
            placeholder="Search by name or company..."
            value={searchTerm}
            onChange={onSearchChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute right-[16px]" width={16} height={16} />
        </div>

        <select
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value as LeadStatus | 'all')}
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
          onChange={e => onSortByChange(e.target.value as 'score' | 'name' | 'company')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="score">Sort by Score</option>
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
        </select>
      </div>
    </div>
  )
}
