import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'
import { jwtStorage } from '../storage/jwtStorage'
import { useAuthStore } from '@/stores/authStore'

export const authApi = {
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials)
    // Handle different token structures based on Postman script
    const data = response.data
    const token = data.token || data.access_token || (data.data && data.data.token)

    const authStore = useAuthStore()
    if (token) {
      authStore.setTokens(token)
      // If user data is returned, save it. Otherwise fetch it.
      if (data.user || (data.data && data.data.user)) {
        authStore.setUser(data.user || data.data.user)
      } else {
        // Fetch user profile if not in login response
        try {
          const profile = await this.getProfile()
          authStore.setUser(profile)
        } catch (e) {
          console.warn('Failed to fetch profile after login', e)
        }
      }
    }

    return response.data
  },

  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.auth.register, userData)
    return response.data
  },

  async verifyOtp(data) {
    const response = await apiClient.post(API_ENDPOINTS.auth.verifyOtp, data)
    // If verification returns a token, save it
    const responseData = response.data
    const token =
      responseData.token ||
      responseData.access_token ||
      (responseData.data && responseData.data.token)

    const authStore = useAuthStore()
    if (token) {
      authStore.setTokens(token)
      try {
        const profile = await this.getProfile()
        authStore.setUser(profile)
      } catch (e) {
        console.warn('Failed to fetch profile after OTP verification', e)
      }
    }
    return response.data
  },

  async resendOtp(data) {
    const response = await apiClient.post(API_ENDPOINTS.auth.sendOtp, data)
    return response.data
  },

  async logout() {
    const authStore = useAuthStore()
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } finally {
      authStore.clearAuth()
    }
  },

  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.auth.me)
    return response.data
  },

  async forgotPassword(data) {
    const response = await apiClient.post(API_ENDPOINTS.auth.forgotPassword, data)
    return response.data
  },

  async resetPassword(data) {
    const response = await apiClient.post(API_ENDPOINTS.auth.resetPassword, data)
    return response.data
  },
}
