import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'
import { jwtStorage } from '../storage/jwtStorage'

export const authApi = {
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials)
    const { accessToken, refreshToken, user } = response.data
    
    jwtStorage.setAccessToken(accessToken)
    jwtStorage.setRefreshToken(refreshToken)
    jwtStorage.setUserData(user)
    
    return response.data
  },
  
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } finally {
      jwtStorage.clearTokens()
    }
  },
  
  async verify() {
    const response = await apiClient.get(API_ENDPOINTS.auth.verify)
    return response.data
  },
  
  async refresh(refreshToken) {
    const response = await apiClient.post(API_ENDPOINTS.auth.refresh, { refreshToken })
    return response.data
  }
}
