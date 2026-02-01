import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const dashboardApi = {
  async getDashboardHome() {
    // Postman: GET /api/dashboard/home
    const response = await apiClient.get(API_ENDPOINTS.dashboard.home)
    return response.data
  },

  async getProgressReport() {
    // Postman: POST /api/dashboard/report
    // Requires 'Accept-Language: ar' or similar
    const response = await apiClient.post(
      API_ENDPOINTS.dashboard.report,
      {},
      {
        headers: {
          'Accept-Language': 'ar',
        },
      },
    )
    return response.data
  },
}
