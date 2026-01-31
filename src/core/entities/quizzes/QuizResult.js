import { QuizAttempt } from './QuizAttempt'

export class QuizResult {
  constructor(data = {}) {
    this.id = data.id || null
    this.quizId = data.quizId || null
    this.userId = data.userId || null
    this.quizTitle = data.quizTitle || ''
    this.attempts = data.attempts ? data.attempts.map(a => QuizAttempt.fromJSON(a)) : []
    this.bestScore = data.bestScore || 0
    this.bestPercentage = data.bestPercentage || 0
    this.averageScore = data.averageScore || 0
    this.totalAttempts = data.totalAttempts || 0
    this.passed = data.passed !== undefined ? data.passed : false
    this.lastAttemptAt = data.lastAttemptAt || null
  }
  
  toJSON() {
    return {
      id: this.id,
      quizId: this.quizId,
      userId: this.userId,
      quizTitle: this.quizTitle,
      attempts: this.attempts.map(a => a.toJSON()),
      bestScore: this.bestScore,
      bestPercentage: this.bestPercentage,
      averageScore: this.averageScore,
      totalAttempts: this.totalAttempts,
      passed: this.passed,
      lastAttemptAt: this.lastAttemptAt
    }
  }
  
  static fromJSON(json) {
    return new QuizResult({
      ...json,
      attempts: json.attempts || [],
      lastAttemptAt: json.lastAttemptAt ? new Date(json.lastAttemptAt) : null
    })
  }
  
  getBestAttempt() {
    if (this.attempts.length === 0) return null
    return this.attempts.reduce((best, attempt) => 
      attempt.percentage > best.percentage ? attempt : best
    )
  }
  
  addAttempt(attempt) {
    this.attempts.push(attempt)
    this.totalAttempts++
    
    if (attempt.percentage > this.bestPercentage) {
      this.bestPercentage = attempt.percentage
      this.bestScore = attempt.score
    }
    
    this.averageScore = this.attempts.reduce((sum, a) => sum + a.percentage, 0) / this.attempts.length
    this.passed = attempt.passed
    this.lastAttemptAt = attempt.completedAt
  }
}
