export class Quiz {
  constructor(data = {}) {
    this.id = data.id || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.subject = data.subject || ''
    this.questions = data.questions || []
    this.timeLimit = data.timeLimit || 30
    this.passingScore = data.passingScore || 70
    this.maxAttempts = data.maxAttempts || 3
    this.isPublished = data.isPublished !== undefined ? data.isPublished : false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
  
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      subject: this.subject,
      questions: this.questions,
      timeLimit: this.timeLimit,
      passingScore: this.passingScore,
      maxAttempts: this.maxAttempts,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
  
  static fromJSON(json) {
    return new Quiz({
      ...json,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }
  
  addQuestion(question) {
    this.questions.push(question)
  }
  
  removeQuestion(questionId) {
    this.questions = this.questions.filter(q => q.id !== questionId)
  }
  
  getTotalQuestions() {
    return this.questions.length
  }
}
