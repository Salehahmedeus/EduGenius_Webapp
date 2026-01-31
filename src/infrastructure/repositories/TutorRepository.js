import { ITutorRepository } from '@/core/repositories/ITutorRepository'
import { tutorApi } from '../api/tutorApi'

export class TutorRepository extends ITutorRepository {
  async getChats() {
    return await tutorApi.getChats()
  }

  async getChatHistory(id) {
    return await tutorApi.getChatHistory(id)
  }

  async askAI(query, file) {
    return await tutorApi.askAI({ query, file })
  }

  async deleteChat(id) {
    return await tutorApi.deleteChat(id)
  }
}
