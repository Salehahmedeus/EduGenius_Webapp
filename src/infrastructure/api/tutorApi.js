import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const tutorApi = {
  async getChats() {
    // Postman: GET /api/ai/chats
    const response = await apiClient.get(API_ENDPOINTS.ai.chats)
    return response.data
  },

  async getChatHistory(id) {
    // Postman: GET /api/ai/history/:id
    const response = await apiClient.get(API_ENDPOINTS.ai.history.replace(':id', id))
    return response.data
  },

  // Originally 'sendMessage', but backend uses 'ask' with optional file
  async askAI(data) {
    // Postman: POST /api/ai/ask
    // Body is FormData: file (optional), query
    const formData = new FormData()
    formData.append('query', data.query)
    if (data.file) {
      formData.append('file', data.file)
    }

    const response = await apiClient.post(API_ENDPOINTS.ai.ask, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deleteChat(id) {
    // Postman: DELETE /api/ai/chats/:id
    const response = await apiClient.delete(API_ENDPOINTS.ai.chat.replace(':id', id))
    return response.data
  },
}
