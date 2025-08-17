export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const ERROR_CODES = {
  LOAD_FAILED: 'LOAD_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  UPDATE_FAILED: 'UPDATE_FAILED',
  DELETE_FAILED: 'DELETE_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const

export const ERROR_MESSAGES = {
  [ERROR_CODES.LOAD_FAILED]: 'Failed to load data',
  [ERROR_CODES.SAVE_FAILED]: 'Failed to save data',
  [ERROR_CODES.UPDATE_FAILED]: 'Failed to update data',
  [ERROR_CODES.DELETE_FAILED]: 'Failed to delete data',
  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid data provided',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed',
} as const

export function createError(
  code: keyof typeof ERROR_CODES,
  context?: string
): AppError {
  const baseMessage = ERROR_MESSAGES[code]
  const message = context ? `${baseMessage}: ${context}` : baseMessage
  return new AppError(message, code)
}

export function handleAsyncError<T>(
  asyncFn: () => Promise<T>,
  errorCode: keyof typeof ERROR_CODES,
  context?: string
): Promise<T> {
  return asyncFn().catch((error) => {
    console.error(`${errorCode}:`, error)
    throw createError(errorCode, context)
  })
}