import { ITutorRepository } from '@/core/repositories/ITutorRepository'
import { Conversation } from '@/core/entities/tutor/Conversation'
import { Message } from '@/core/entities/tutor/Message'
import { tutorApi } from '../api/tutorApi'

export class TutorRepository extends ITutorRepository {
  async saveConversation(conversation) {
    if (conversation.session.id) {
      const response = await tutorApi.getConversation(conversation.session.id)
      return Conversation.fromJSON(response)
    }
    
    const response = await tutorApi.createConversation({
      title: conversation.session.title,
      subject: conversation.session.subject
    })
    
    return Conversation.fromJSON(response)
  }
  
  async saveMessage(message) {
    const response = await tutorApi.sendMessage(message.sessionId, {
      role: message.role,
      content: message.content
    })
    
    return Message.fromJSON(response)
  }
  
  async getConversation(conversationId) {
    const response = await tutorApi.getConversation(conversationId)
    return Conversation.fromJSON(response)
  }
  
  async getConversations(userId) {
    const response = await tutorApi.getConversations({ userId })
    return response.map(c => Conversation.fromJSON(c))
  }
  
  async deleteConversation(conversationId) {
    await tutorApi.deleteConversation(conversationId)
    return true
  }
}
