import { DashboardStats } from '@/core/entities/dashboard/DashboardStats'
import { UserActivity } from '@/core/entities/dashboard/UserActivity'
import { ProgressReport } from '@/core/entities/dashboard/ProgressReport'

export class AnalyticsService {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }
  
  async getDashboardStats(userId) {
    const statsData = await this.dashboardRepository.getStats(userId)
    return DashboardStats.fromJSON(statsData)
  }
  
  async getUserProgress(userId, startDate, endDate) {
    const progressData = await this.dashboardRepository.getProgress(userId, startDate, endDate)
    return ProgressReport.fromJSON(progressData)
  }
  
  async getUserActivity(userId, limit = 10) {
    const activityData = await this.dashboardRepository.getActivity(userId, limit)
    return activityData.map(a => UserActivity.fromJSON(a))
  }
  
  async generateReport(userId, startDate, endDate) {
    const stats = await this.getDashboardStats(userId)
    const progress = await this.getUserProgress(userId, startDate, endDate)
    const activities = await this.getUserActivity(userId, 100)
    
    return {
      stats,
      progress,
      activities,
      generatedAt: new Date()
    }
  }
  
  calculateAverageScore(attempts) {
    if (attempts.length === 0) return 0
    
    const total = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0)
    return total / attempts.length
  }
  
  calculateStudyTime(sessions) {
    return sessions.reduce((total, session) => total + (session.duration || 0), 0)
  }
}
