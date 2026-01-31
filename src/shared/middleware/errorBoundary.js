import { ERROR_CODES } from '@/shared/constants/errorCodes'

export class AppError extends Error {
  constructor(code, message, details = null) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
  }
}

export class AuthError extends AppError {
  constructor(code, message, details = null) {
    super(code, message, details)
    this.name = 'AuthError'
  }
}

export class ApiError extends AppError {
  constructor(code, message, details = null) {
    super(code, message, details)
    this.name = 'ApiError'
    this.status = details?.status
  }
}

export const errorBoundary = (error, instance, info) => {
  console.error('Error caught by error boundary:', error)
  console.error('Component:', instance)
  console.error('Info:', info)
}

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    if (status === 401) {
      throw new AuthError(
        ERROR_CODES.AUTH.TOKEN_EXPIRED,
        data.message || 'Session expired',
        { status }
      )
    }
    
    if (status === 403) {
      throw new AuthError(
        ERROR_CODES.AUTH.TOKEN_INVALID,
        data.message || 'Access denied',
        { status }
      )
    }
    
    if (status === 404) {
      throw new ApiError(
        ERROR_CODES.API.NOT_FOUND,
        data.message || 'Resource not found',
        { status }
      )
    }
    
    if (status === 429) {
      throw new ApiError(
        ERROR_CODES.API.RATE_LIMITED,
        data.message || 'Too many requests',
        { status }
      )
    }
    
    if (status >= 500) {
      throw new ApiError(
        ERROR_CODES.API.SERVER_ERROR,
        data.message || 'Server error',
        { status }
      )
    }
    
    throw new ApiError(
      ERROR_CODES.API.VALIDATION_ERROR,
      data.message || 'Invalid request',
      { status, data }
    )
  }
  
  if (error.request) {
    throw new ApiError(
      ERROR_CODES.API.NETWORK_ERROR,
      'Network error. Please check your connection.'
    )
  }
  
  throw error
}

export const getErrorMessage = (error) => {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  return error.message || 'An unexpected error occurred'
}

export const getErrorCode = (error) => {
  if (error instanceof AppError) {
    return error.code
  }
  
  return null
}
