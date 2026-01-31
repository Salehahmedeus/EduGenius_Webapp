export class Lesson {
  constructor(data = {}) {
    this.id = data.id || null
    this.moduleId = data.moduleId || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.content = data.content || ''
    this.videoUrl = data.videoUrl || null
    this.resources = data.resources || []
    this.order = data.order || 0
    this.duration = data.duration || 0
    this.isPublished = data.isPublished !== undefined ? data.isPublished : false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
  
  toJSON() {
    return {
      id: this.id,
      moduleId: this.moduleId,
      title: this.title,
      description: this.description,
      content: this.content,
      videoUrl: this.videoUrl,
      resources: this.resources,
      order: this.order,
      duration: this.duration,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
  
  static fromJSON(json) {
    return new Lesson({
      ...json,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }
  
  addResource(resource) {
    this.resources.push(resource)
  }
  
  removeResource(resourceId) {
    this.resources = this.resources.filter(r => r.id !== resourceId)
  }
}
