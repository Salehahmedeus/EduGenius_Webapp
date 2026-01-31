import { Conversation } from '@/core/entities/tutor/Conversation'
import { Message } from '@/core/entities/tutor/Message'

export class ConversationService {
  constructor(tutorRepository) {
    this.tutorRepository = tutorRepository
  }
  
  async createConversation(userId, title = 'New Conversation') {
    const conversation = new Conversation({
      session: {
        userId,
        title
      }
    })
    
    return await this.tutorRepository.saveConversation(conversation)
  }
  
  async addMessage(conversationId, role, content) {
    const message = new Message({
      sessionId: conversationId,
      role,
      content
    })
    
    return await this.tutorRepository.saveMessage(message)
  }
  
  async getConversation(conversationId) {
    return await this.tutorRepository.getConversation(conversationId)
  }
  
  async getConversations(userId) {
    return await this.tutorRepository.getConversations(userId)
  }
  
  async deleteConversation(conversationId) {
    return await this.tutorRepository.deleteConversation(conversationId)
  }
  
  async getContext(conversationId, limit = 10) {
    const conversation = await this.getConversation(conversationId)
    return conversation ? conversation.getContext(limit) : []
  }
}
