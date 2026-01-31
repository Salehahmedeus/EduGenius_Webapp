import { IDashboardRepository } from '@/core/repositories/IDashboardRepository'
import { dashboardApi } from '../api/dashboardApi'

export class DashboardRepository extends IDashboardRepository {
  async getDashboardHome() {
    return await dashboardApi.getDashboardHome()
  }

  async getProgressReport() {
    return await dashboardApi.getProgressReport()
  }
}
