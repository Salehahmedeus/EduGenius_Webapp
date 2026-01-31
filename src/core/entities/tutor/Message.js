export class Message {
  constructor(data = {}) {
    this.id = data.id || null
    this.sessionId = data.sessionId || null
    this.role = data.role || 'user'
    this.content = data.content || ''
    this.timestamp = data.timestamp || new Date()
    this.isTyping = data.isTyping || false
  }
  
  toJSON() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      role: this.role,
      content: this.content,
      timestamp: this.timestamp,
      isTyping: this.isTyping
    }
  }
  
  static fromJSON(json) {
    return new Message({
      ...json,
      timestamp: json.timestamp ? new Date(json.timestamp) : new Date()
    })
  }
  
  isUser() {
    return this.role === 'user'
  }
  
  isAssistant() {
    return this.role === 'assistant' || this.role === 'model'
  }
  
  isValid() {
    return this.content && this.content.trim().length > 0
  }
}
