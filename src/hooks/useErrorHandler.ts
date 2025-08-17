import { useState, useCallback } from 'react'
import { AppError, createError, ERROR_CODES } from '../utils/error'

interface UseErrorHandlerReturn {
  error: string | null
  setError: (error: string | Error | null) => void
  clearError: () => void
  handleError: (error: unknown, fallbackCode?: keyof typeof ERROR_CODES) => void
  executeWithErrorHandling: <T>(
    asyncFn: () => Promise<T>,
    errorCode?: keyof typeof ERROR_CODES,
    context?: string
  ) => Promise<T | null>
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<string | null>(null)

  const setError = useCallback((error: string | Error | null) => {
    if (error === null) {
      setErrorState(null)
    } else if (error instanceof Error) {
      setErrorState(error.message)
    } else {
      setErrorState(error)
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  const handleError = useCallback((
    error: unknown,
    fallbackCode: keyof typeof ERROR_CODES = 'LOAD_FAILED'
  ) => {
    console.error('Error occurred:', error)
    
    if (error instanceof AppError) {
      setError(error.message)
    } else if (error instanceof Error) {
      setError(error.message)
    } else {
      const appError = createError(fallbackCode)
      setError(appError.message)
    }
  }, [setError])

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorCode: keyof typeof ERROR_CODES = 'LOAD_FAILED',
    context?: string
  ): Promise<T | null> => {
    try {
      clearError()
      return await asyncFn()
    } catch (error) {
      const appError = createError(errorCode, context)
      console.error(`${errorCode}:`, error)
      setError(appError)
      return null
    }
  }, [clearError, setError])

  return {
    error,
    setError,
    clearError,
    handleError,
    executeWithErrorHandling,
  }
}