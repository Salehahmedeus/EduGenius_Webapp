import { DashboardStats } from '@/core/entities/dashboard/DashboardStats'
import { UserActivity } from '@/core/entities/dashboard/UserActivity'
import { ProgressReport } from '@/core/entities/dashboard/ProgressReport'

export class AnalyticsService {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async getDashboardData() {
    const data = await this.dashboardRepository.getDashboardHome()
    // Map backend response to entities if needed.
    // Assuming data structure roughly matches what we need or is a superset.
    return {
      stats: data.stats ? DashboardStats.fromJSON(data.stats) : null,
      recentActivity: data.activities ? data.activities.map((a) => UserActivity.fromJSON(a)) : [],
    }
  }

  async getProgressReport() {
    const data = await this.dashboardRepository.getProgressReport()
    return ProgressReport.fromJSON(data)
  }

  // Helper methods likely remain useful for local calculations

  calculateAverageScore(attempts) {
    if (attempts.length === 0) return 0

    const total = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0)
    return total / attempts.length
  }

  calculateStudyTime(sessions) {
    return sessions.reduce((total, session) => total + (session.duration || 0), 0)
  }
}
