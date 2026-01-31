export class ProgressReport {
  constructor(data = {}) {
    this.id = data.id || null
    this.userId = data.userId || null
    this.startDate = data.startDate || new Date()
    this.endDate = data.endDate || new Date()
    this.totalActivities = data.totalActivities || 0
    this.studyTime = data.studyTime || 0
    this.quizzesTaken = data.quizzesTaken || 0
    this.averageScore = data.averageScore || 0
    this.coursesCompleted = data.coursesCompleted || 0
    this.coursesInProgress = data.coursesInProgress || 0
    this.activities = data.activities || []
  }
  
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      startDate: this.startDate,
      endDate: this.endDate,
      totalActivities: this.totalActivities,
      studyTime: this.studyTime,
      quizzesTaken: this.quizzesTaken,
      averageScore: this.averageScore,
      coursesCompleted: this.coursesCompleted,
      coursesInProgress: this.coursesInProgress,
      activities: this.activities
    }
  }
  
  static fromJSON(json) {
    return new ProgressReport({
      ...json,
      startDate: json.startDate ? new Date(json.startDate) : new Date(),
      endDate: json.endDate ? new Date(json.endDate) : new Date()
    })
  }
  
  addActivity(activity) {
    this.activities.push(activity)
    this.totalActivities++
  }
}
