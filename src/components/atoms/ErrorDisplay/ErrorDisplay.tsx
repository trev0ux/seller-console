interface ErrorDisplayProps {
  error: string | Error | null
  title?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorDisplay({
  error,
  title = 'Error',
  onRetry,
  className = '',
}: ErrorDisplayProps) {
  if (!error) return null

  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="text-red-700 font-medium">{title}</div>
      <div className="text-red-600 mt-1">{errorMessage}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          Try again
        </button>
      )}
    </div>
  )
}