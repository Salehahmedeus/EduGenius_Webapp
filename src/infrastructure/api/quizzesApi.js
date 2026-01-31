import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const quizzesApi = {
  async getQuizzes(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.quizzes.list, { params })
    return response.data
  },
  
  async getQuiz(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.quizzes.list}/${id}`)
    return response.data
  },
  
  async createQuiz(data) {
    const response = await apiClient.post(API_ENDPOINTS.quizzes.create, data)
    return response.data
  },
  
  async updateQuiz(id, data) {
    const response = await apiClient.put(`${API_ENDPOINTS.quizzes.list}/${id}`, data)
    return response.data
  },
  
  async deleteQuiz(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.quizzes.list}/${id}`)
    return response.data
  },
  
  async submitQuiz(id, data) {
    const response = await apiClient.post(`${API_ENDPOINTS.quizzes.submit.replace(':id', id)}`, data)
    return response.data
  },
  
  async getQuizResults(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.quizzes.results.replace(':id', id)}`)
    return response.data
  },
  
  async gradeQuiz(id, attemptId) {
    const response = await apiClient.post(`${API_ENDPOINTS.quizzes.grade.replace(':id', id)}`, { attemptId })
    return response.data
  }
}
