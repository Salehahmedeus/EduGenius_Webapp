import { APP_CONSTANTS } from '@/shared/constants/appConstants'

class JwtStorage {
  constructor() {
    this.accessTokenKey = APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN
    this.refreshTokenKey = APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN
    this.userDataKey = APP_CONSTANTS.STORAGE_KEYS.USER_DATA
  }
  
  setAccessToken(token) {
    localStorage.setItem(this.accessTokenKey, token)
  }
  
  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey)
  }
  
  setRefreshToken(token) {
    localStorage.setItem(this.refreshTokenKey, token)
  }
  
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey)
  }
  
  setUserData(userData) {
    localStorage.setItem(this.userDataKey, JSON.stringify(userData))
  }
  
  getUserData() {
    const data = localStorage.getItem(this.userDataKey)
    return data ? JSON.parse(data) : null
  }
  
  clearTokens() {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    localStorage.removeItem(this.userDataKey)
  }
  
  isTokenExpired(token) {
    if (!token) return true
    
    try {
      const payload = this.parseToken(token)
      if (!payload || !payload.exp) return true
      
      const expirationTime = payload.exp * 1000
      return Date.now() >= expirationTime
    } catch {
      return true
    }
  }
  
  parseToken(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }
  
  getTokenExpirationTime(token) {
    const payload = this.parseToken(token)
    return payload && payload.exp ? payload.exp * 1000 : null
  }
  
  async refreshToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available')
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })
    
    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }
    
    const data = await response.json()
    this.setAccessToken(data.accessToken)
    
    return data.accessToken
  }
}

export const jwtStorage = new JwtStorage()
