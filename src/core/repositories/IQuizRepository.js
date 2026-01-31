export class IQuizRepository {
  async saveQuiz(quiz) {
    throw new Error('Method not implemented')
  }
  
  async getQuiz(quizId) {
    throw new Error('Method not implemented')
  }
  
  async getQuizzes(filters = {}) {
    throw new Error('Method not implemented')
  }
  
  async deleteQuiz(quizId) {
    throw new Error('Method not implemented')
  }
  
  async saveAttempt(attempt) {
    throw new Error('Method not implemented')
  }
  
  async getAttempt(attemptId) {
    throw new Error('Method not implemented')
  }
  
  async getQuizAttempts(quizId, userId) {
    throw new Error('Method not implemented')
  }
  
  async getQuizResult(quizId, userId) {
    throw new Error('Method not implemented')
  }
  
  async getAvailableQuizzes(userId) {
    throw new Error('Method not implemented')
  }
}
