import { TutorSession } from './TutorSession'
import { Message } from './Message'

export class Conversation {
  constructor(data = {}) {
    this.session = new TutorSession(data.session)
    this.messages = data.messages ? data.messages.map(m => Message.fromJSON(m)) : []
    this.totalMessages = data.totalMessages || this.messages.length
  }
  
  toJSON() {
    return {
      session: this.session.toJSON(),
      messages: this.messages.map(m => m.toJSON()),
      totalMessages: this.totalMessages
    }
  }
  
  static fromJSON(json) {
    return new Conversation({
      session: json.session,
      messages: json.messages,
      totalMessages: json.totalMessages
    })
  }
  
  addMessage(message) {
    this.messages.push(message)
    this.totalMessages++
  }
  
  getLastMessage() {
    return this.messages[this.messages.length - 1] || null
  }
  
  getMessages() {
    return this.messages
  }
  
  getMessageById(id) {
    return this.messages.find(m => m.id === id) || null
  }
  
  clearMessages() {
    this.messages = []
    this.totalMessages = 0
  }
  
  getContext(limit = 10) {
    return this.messages.slice(-limit)
  }
}
