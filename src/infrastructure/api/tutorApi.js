import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const tutorApi = {
  async getConversations() {
    const response = await apiClient.get(API_ENDPOINTS.tutor.conversations)
    return response.data
  },
  
  async getConversation(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.tutor.conversations}/${id}`)
    return response.data
  },
  
  async createConversation(data) {
    const response = await apiClient.post(API_ENDPOINTS.tutor.conversations, data)
    return response.data
  },
  
  async sendMessage(conversationId, message) {
    const response = await apiClient.post(API_ENDPOINTS.tutor.sendMessage, {
      conversationId,
      message
    })
    return response.data
  },
  
  async getMessages(conversationId) {
    const response = await apiClient.get(`${API_ENDPOINTS.tutor.conversations}/${conversationId}/messages`)
    return response.data
  },
  
  async deleteConversation(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.tutor.conversations}/${id}`)
    return response.data
  }
}
