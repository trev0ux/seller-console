import type { ComponentProps } from 'react'

export interface IconProps extends ComponentProps<'svg'> {
  size?: number | string
}

export const Icon = ({ size = 20, className = '', ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  )
}