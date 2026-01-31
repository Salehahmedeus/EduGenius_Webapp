import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'
import { jwtStorage } from '../storage/jwtStorage'

export const authApi = {
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials)
    // Handle different token structures based on Postman script
    const data = response.data
    const token = data.token || data.access_token || (data.data && data.data.token)

    if (token) {
      jwtStorage.setAccessToken(token)
      // If user data is returned, save it. Otherwise fetch it.
      if (data.user || (data.data && data.data.user)) {
        jwtStorage.setUserData(data.user || data.data.user)
      } else {
        // Fetch user profile if not in login response
        try {
          const profile = await this.getProfile()
          jwtStorage.setUserData(profile)
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

  async verifyOtp(email, otp) {
    const response = await apiClient.post(API_ENDPOINTS.auth.verifyOtp, { email, otp })
    // If verification returns a token, save it
    const data = response.data
    const token = data.token || data.access_token || (data.data && data.data.token)

    if (token) {
      jwtStorage.setAccessToken(token)
      try {
        const profile = await this.getProfile()
        jwtStorage.setUserData(profile)
      } catch (e) {
        console.warn('Failed to fetch profile after OTP verification', e)
      }
    }
    return response.data
  },

  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } finally {
      jwtStorage.clearTokens()
    }
  },

  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.auth.me)
    return response.data
  },

  async forgotPassword(email) {
    const response = await apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email })
    return response.data
  },

  async resetPassword(data) {
    const response = await apiClient.post(API_ENDPOINTS.auth.resetPassword, data)
    return response.data
  },
}
