export class Answer {
  constructor(data = {}) {
    this.id = data.id || null
    this.questionId = data.questionId || null
    this.answer = data.answer || null
    this.isCorrect = data.isCorrect !== undefined ? data.isCorrect : false
    this.pointsEarned = data.pointsEarned || 0
  }
  
  toJSON() {
    return {
      id: this.id,
      questionId: this.questionId,
      answer: this.answer,
      isCorrect: this.isCorrect,
      pointsEarned: this.pointsEarned
    }
  }
  
  static fromJSON(json) {
    return new Answer(json)
  }
}
