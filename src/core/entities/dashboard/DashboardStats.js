export class DashboardStats {
  constructor(data = {}) {
    this.totalCourses = data.totalCourses || 0
    this.completedCourses = data.completedCourses || 0
    this.totalQuizzes = data.totalQuizzes || 0
    this.averageScore = data.averageScore || 0
    this.totalStudyTime = data.totalStudyTime || 0
    this.activeStreak = data.activeStreak || 0
    this.totalSessions = data.totalSessions || 0
    this.lastActive = data.lastActive || null
  }
  
  toJSON() {
    return {
      totalCourses: this.totalCourses,
      completedCourses: this.completedCourses,
      totalQuizzes: this.totalQuizzes,
      averageScore: this.averageScore,
      totalStudyTime: this.totalStudyTime,
      activeStreak: this.activeStreak,
      totalSessions: this.totalSessions,
      lastActive: this.lastActive
    }
  }
  
  static fromJSON(json) {
    return new DashboardStats({
      totalCourses: json.totalCourses,
      completedCourses: json.completedCourses,
      totalQuizzes: json.totalQuizzes,
      averageScore: json.averageScore,
      totalStudyTime: json.totalStudyTime,
      activeStreak: json.activeStreak,
      totalSessions: json.totalSessions,
      lastActive: json.lastActive ? new Date(json.lastActive) : null
    })
  }
  
  getCompletionRate() {
    return this.totalCourses > 0
      ? (this.completedCourses / this.totalCourses) * 100
      : 0
  }
}
