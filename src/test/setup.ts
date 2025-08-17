import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock icon components globally
vi.mock('../components/atoms/Icon', () => ({
  LoaderIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'loader-icon', className, ...props }),
  ChevronLeftIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'chevron-left-icon', className, ...props }),
  ChevronRightIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'chevron-right-icon', className, ...props }),
  XIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'x-icon', className, ...props }),
  UsersIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'users-icon', className, ...props }),
  CheckCircleIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'check-circle-icon', className, ...props }),
  DollarSignIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'dollar-sign-icon', className, ...props }),
  BarChartIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'bar-chart-icon', className, ...props }),
  TrendingUpIcon: ({ className = '', ...props }: any) =>
    React.createElement('div', { 'data-testid': 'trending-up-icon', className, ...props }),
}))