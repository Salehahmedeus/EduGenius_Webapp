import { Conversation } from '@/core/entities/tutor/Conversation'
import { Message } from '@/core/entities/tutor/Message'

export class ConversationService {
  constructor(tutorRepository) {
    this.tutorRepository = tutorRepository
  }

  async createConversation(userId, title = 'New Chat') {
    // In this API, conversations are likely created by asking a question.
    // This method might just return a local placeholder or be unused.
    return new Conversation({ session: { userId, title } })
  }

  async sendMessage(query, file = null) {
    // 'askAI' is the primary way to interact
    const response = await this.tutorRepository.askAI(query, file)
    // Response likely contains the AI's answer and maybe a session ID?
    // We'll return it raw for now or map it if we knew the shape.
    return response
  }

  async getConversation(id) {
    // Maps to 'getChatHistory'
    const history = await this.tutorRepository.getChatHistory(id)
    // TODO: Map 'history' to Conversation entity if needed
    return history
  }

  async getConversations() {
    // Maps to 'getChats'
    const chats = await this.tutorRepository.getChats()
    // TODO: Map 'chats' to Conversation entities if needed
    return chats
  }

  async deleteConversation(id) {
    return await this.tutorRepository.deleteChat(id)
  }
}
