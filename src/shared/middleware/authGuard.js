import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import { ERROR_CODES, ERROR_MESSAGES } from '@/shared/constants/errorCodes'
import router from '@/router'

export const authGuard = async (to, from, next) => {
  const token = jwtStorage.getAccessToken()
  
  if (!token) {
    if (to.path !== '/login') {
      return next({ name: 'login' })
    }
    return next()
  }
  
  const isExpired = jwtStorage.isTokenExpired(token)
  
  if (isExpired) {
    try {
      await jwtStorage.refreshToken()
      return next()
    } catch (error) {
      jwtStorage.clearTokens()
      if (to.path !== '/login') {
        return next({ name: 'login' })
      }
      return next()
    }
  }
  
  next()
}

export const guestGuard = (to, from, next) => {
  const token = jwtStorage.getAccessToken()
  
  if (token && !jwtStorage.isTokenExpired(token)) {
    return next({ name: 'dashboard' })
  }
  
  next()
}

export const adminGuard = async (to, from, next) => {
  const token = jwtStorage.getAccessToken()
  
  if (!token) {
    return next({ name: 'login' })
  }
  
  const userData = jwtStorage.getUserData()
  
  if (!userData || userData.role !== 'admin') {
    return next({ name: 'dashboard' })
  }
  
  next()
}

export const requireGeminiKey = async (to, from, next) => {
  const token = jwtStorage.getAccessToken()
  
  if (!token) {
    return next({ name: 'login' })
  }
  
  const { geminiKeyStorage } = await import('@/infrastructure/storage/geminiKeyStorage')
  const hasGeminiKey = geminiKeyStorage.hasKey()
  
  if (!hasGeminiKey) {
    return next({ name: 'settings' })
  }
  
  next()
}
