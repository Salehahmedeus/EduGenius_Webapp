export class UserActivity {
  constructor(data = {}) {
    this.id = data.id || null
    this.userId = data.userId || null
    this.type = data.type || 'login'
    this.description = data.description || ''
    this.timestamp = data.timestamp || new Date()
    this.metadata = data.metadata || {}
  }
  
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      description: this.description,
      timestamp: this.timestamp,
      metadata: this.metadata
    }
  }
  
  static fromJSON(json) {
    return new UserActivity({
      ...json,
      timestamp: json.timestamp ? new Date(json.timestamp) : new Date()
    })
  }
}
