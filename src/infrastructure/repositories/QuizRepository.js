import { IQuizRepository } from '@/core/repositories/IQuizRepository'
import { quizzesApi } from '../api/quizzesApi'

export class QuizRepository extends IQuizRepository {
  async getAllQuizzes() {
    return await quizzesApi.getAllQuizzes()
  }

  async getQuiz(id) {
    return await quizzesApi.getQuiz(id)
  }

  async generateQuiz(topic, difficulty) {
    return await quizzesApi.generateQuiz(topic, difficulty)
  }

  async submitQuiz(data) {
    return await quizzesApi.submitQuiz(data)
  }
}
