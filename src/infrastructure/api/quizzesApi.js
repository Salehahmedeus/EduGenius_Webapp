import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const quizzesApi = {
  async getAllQuizzes() {
    // Postman: GET /api/quiz/all
    const response = await apiClient.get(API_ENDPOINTS.quiz.all)
    return response.data
  },

  async getQuiz(id) {
    // Postman: GET /api/quiz/:id
    const response = await apiClient.get(API_ENDPOINTS.quiz.detail.replace(':id', id))
    return response.data
  },

  async generateQuiz(topic, difficulty) {
    // Postman: POST /api/quiz/generate
    const response = await apiClient.post(API_ENDPOINTS.quiz.generate, {
      topic,
      difficulty,
    })
    return response.data
  },

  async submitQuiz(data) {
    // Postman: POST /api/quiz/submit
    const response = await apiClient.post(API_ENDPOINTS.quiz.submit, data)
    return response.data
  },
}
