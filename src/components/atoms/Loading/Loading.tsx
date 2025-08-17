import type { LoadingProps } from './Loading.types'

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const colors = {
  blue: 'border-blue-600',
  gray: 'border-gray-600',
  white: 'border-white',
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const textColors = {
  blue: 'text-blue-600',
  gray: 'text-gray-600',
  white: 'text-white',
}

export default function Loading({
  size = 'md',
  text,
  className = '',
  fullScreen = false,
  color = 'blue',
}: LoadingProps) {
  const sizeClass = sizes[size]
  const colorClass = colors[color]
  const textSizeClass = textSizes[size]
  const textColorClass = textColors[color]

  const spinner = (
    <div
      className={`animate-spin rounded-full ${sizeClass} border-2 border-transparent ${colorClass} border-t-blue-600`}
    ></div>
  )

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {spinner}
      {text && <span className={`${textSizeClass} ${textColorClass} font-medium`}>{text}</span>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed top-0 left-0 inset-0 bg-white bg-opacity-75 w-full h-full flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}
