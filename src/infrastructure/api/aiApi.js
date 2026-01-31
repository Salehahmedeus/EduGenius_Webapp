import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const aiApi = {
  /**
   * Fetch all AI chat sessions
   */
  async fetchChats() {
    const response = await apiClient.get(API_ENDPOINTS.ai.chats)
    return response.data
  },

  /**
   * Fetch message history for a specific chat session
   * @param {number|string} id - The conversation ID
   */
  async fetchHistory(id) {
    const response = await apiClient.get(API_ENDPOINTS.ai.history.replace(':id', id))
    return response.data
  },

  /**
   * Send a question to the AI (Unified Ask)
   * @param {FormData} formData - Contains query, conversation_id (optional), and file (optional)
   */
  async ask(formData) {
    const response = await apiClient.post(API_ENDPOINTS.ai.ask, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * Delete a chat session
   * @param {number|string} id - The conversation ID
   */
  async deleteChat(id) {
    // API might expect DELETE /api/ai/chats/{id}
    // API_ENDPOINTS.ai.chat is '/ai/chats/:id'
    const url = API_ENDPOINTS.ai.chat.replace(':id', id)
    const response = await apiClient.delete(url)
    return response.data
  },
}
