import React, { type ReactElement } from 'react'
import type { Lead, Opportunity } from '../../types'
import PanelHeader from '../molecules/PanelHeader/PanelHeader'

interface LeadDetailPanelProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: number, updates: Partial<Lead>) => Promise<void>
  children: ReactElement
  onConvertToOpportunity: (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>
  ) => Promise<void>
}

function Body({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Footer({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function Sidebar({ lead, isOpen, onClose, children }: LeadDetailPanelProps) {
  const body = React.Children.toArray(children)
    .filter(React.isValidElement)
    .find(child => child.type === Body)

  const footer = React.Children.toArray(children)
    .filter(React.isValidElement)
    .find(child => child.type === Footer)

  if (!isOpen || !lead) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          <PanelHeader handleCancel={onClose} onClose={onClose} />

          <main className="flex-1 overflow-y-auto p-6">{body}</main>

          {footer && <footer className="border-t border-gray-200 p-6 bg-gray-50">{footer}</footer>}
        </div>
      </div>
    </>
  )
}

Sidebar.Body = Body
Sidebar.Footer = Footer
