import axios from 'axios'
import { jwtStorage } from '../storage/jwtStorage'
import { handleApiError } from '@/shared/middleware/errorBoundary'
import { API_BASE_URL } from '@/shared/constants/apiEndpoints'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = jwtStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add Language Header for I18N
    const locale = localStorage.getItem('user_locale') || 'en'
    config.headers['Accept-Language'] = locale

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newToken = await jwtStorage.refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        jwtStorage.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    handleApiError(error)
    return Promise.reject(error)
  },
)

export default apiClient
