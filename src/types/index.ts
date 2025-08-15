export interface Lead {
  id: number
  name: string
  company: string
  email: string
  source: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'lost'
}

export interface Opportunity {
  id: number
  name: string
  stage: string
  amount?: number
  accountName: string
  leadId: number
}

export type LeadStatus = Lead['status']
export type SortField = 'score' | 'name' | 'company'
export type SortOrder = 'asc' | 'desc'
