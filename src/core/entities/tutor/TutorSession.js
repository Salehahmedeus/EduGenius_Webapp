export class TutorSession {
  constructor(data = {}) {
    this.id = data.id || null
    this.userId = data.userId || null
    this.title = data.title || 'New Conversation'
    this.subject = data.subject || null
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    this.isActive = data.isActive !== undefined ? data.isActive : true
  }
  
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      subject: this.subject,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    }
  }
  
  static fromJSON(json) {
    return new TutorSession({
      ...json,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }
}
