import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const dashboardApi = {
  async getStats() {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.stats)
    return response.data
  },
  
  async getProgress(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.progress, { params })
    return response.data
  },
  
  async generateReport(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.report, { params })
    return response.data
  },
  
  async getActivity(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.activity, { params })
    return response.data
  }
}
