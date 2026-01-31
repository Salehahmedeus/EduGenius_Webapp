export class Question {
  constructor(data = {}) {
    this.id = data.id || null
    this.quizId = data.quizId || null
    this.type = data.type || 'multiple_choice'
    this.question = data.question || ''
    this.options = data.options || []
    this.correctAnswer = data.correctAnswer || null
    this.points = data.points || 1
    this.explanation = data.explanation || ''
    this.order = data.order || 0
  }
  
  toJSON() {
    return {
      id: this.id,
      quizId: this.quizId,
      type: this.type,
      question: this.question,
      options: this.options,
      correctAnswer: this.correctAnswer,
      points: this.points,
      explanation: this.explanation,
      order: this.order
    }
  }
  
  static fromJSON(json) {
    return new Question(json)
  }
  
  isMultipleChoice() {
    return this.type === 'multiple_choice'
  }
  
  isTrueFalse() {
    return this.type === 'true_false'
  }
  
  isShortAnswer() {
    return this.type === 'short_answer'
  }
}
