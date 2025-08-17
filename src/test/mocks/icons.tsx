import { vi } from 'vitest'

export const LoaderIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="loader-icon" className={className} {...props} />
))

export const ChevronLeftIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="chevron-left-icon" className={className} {...props} />
))

export const ChevronRightIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="chevron-right-icon" className={className} {...props} />
))

export const XIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="x-icon" className={className} {...props} />
))

export const UsersIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="users-icon" className={className} {...props} />
))

export const CheckCircleIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="check-circle-icon" className={className} {...props} />
))

export const DollarSignIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="dollar-sign-icon" className={className} {...props} />
))

export const BarChartIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="bar-chart-icon" className={className} {...props} />
))

export const TrendingUpIcon = vi.fn(({ className = '', ...props }) => (
  <div data-testid="trending-up-icon" className={className} {...props} />
))