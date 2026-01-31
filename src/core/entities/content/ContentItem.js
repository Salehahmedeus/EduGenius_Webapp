export class ContentItem {
  constructor(data = {}) {
    this.id = data.id || null
    this.type = data.type || 'text'
    this.title = data.title || ''
    this.content = data.content || ''
    this.url = data.url || null
    this.metadata = data.metadata || {}
    this.order = data.order || 0
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
  
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      content: this.content,
      url: this.url,
      metadata: this.metadata,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
  
  static fromJSON(json) {
    return new ContentItem({
      ...json,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }
  
  isText() {
    return this.type === 'text'
  }
  
  isVideo() {
    return this.type === 'video'
  }
  
  isImage() {
    return this.type === 'image'
  }
  
  isDocument() {
    return this.type === 'document'
  }
}
