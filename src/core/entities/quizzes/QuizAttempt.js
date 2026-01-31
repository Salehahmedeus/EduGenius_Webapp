import { Answer } from './Answer'

export class QuizAttempt {
  constructor(data = {}) {
    this.id = data.id || null
    this.quizId = data.quizId || null
    this.userId = data.userId || null
    this.answers = data.answers ? data.answers.map(a => Answer.fromJSON(a)) : []
    this.score = data.score || 0
    this.percentage = data.percentage || 0
    this.passed = data.passed !== undefined ? data.passed : false
    this.timeSpent = data.timeSpent || 0
    this.startedAt = data.startedAt || new Date()
    this.completedAt = data.completedAt || null
  }
  
  toJSON() {
    return {
      id: this.id,
      quizId: this.quizId,
      userId: this.userId,
      answers: this.answers.map(a => a.toJSON()),
      score: this.score,
      percentage: this.percentage,
      passed: this.passed,
      timeSpent: this.timeSpent,
      startedAt: this.startedAt,
      completedAt: this.completedAt
    }
  }
  
  static fromJSON(json) {
    return new QuizAttempt({
      ...json,
      startedAt: json.startedAt ? new Date(json.startedAt) : new Date(),
      completedAt: json.completedAt ? new Date(json.completedAt) : null
    })
  }
  
  addAnswer(answer) {
    this.answers.push(answer)
  }
  
  getAnswer(questionId) {
    return this.answers.find(a => a.questionId === questionId) || null
  }
  
  isCompleted() {
    return this.completedAt !== null
  }
}
