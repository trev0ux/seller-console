import React from 'react'
import type { Opportunity } from '../../types'

interface OpportunitiesTableProps {
  opportunities: Opportunity[]
}

export default function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage your sales opportunities
          </p>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500">
            No opportunities yet. Convert leads to create opportunities.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track and manage your sales opportunities
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map(opportunity => (
              <tr key={opportunity.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {opportunity.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      opportunity.stage === 'qualification'
                        ? 'bg-blue-100 text-blue-800'
                        : opportunity.stage === 'proposal'
                          ? 'bg-yellow-100 text-yellow-800'
                          : opportunity.stage === 'negotiation'
                            ? 'bg-orange-100 text-orange-800'
                            : opportunity.stage === 'closed-won'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {opportunity.stage.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {opportunity.amount
                      ? `$${opportunity.amount.toLocaleString()}`
                      : 'Not specified'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{opportunity.accountName}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}