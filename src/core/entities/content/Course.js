export class Course {
  constructor(data = {}) {
    this.id = data.id || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.instructorId = data.instructorId || null
    this.category = data.category || null
    this.thumbnail = data.thumbnail || null
    this.modules = data.modules || []
    this.duration = data.duration || 0
    this.difficulty = data.difficulty || 'beginner'
    this.tags = data.tags || []
    this.isPublished = data.isPublished !== undefined ? data.isPublished : false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
  
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      instructorId: this.instructorId,
      category: this.category,
      thumbnail: this.thumbnail,
      modules: this.modules,
      duration: this.duration,
      difficulty: this.difficulty,
      tags: this.tags,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
  
  static fromJSON(json) {
    return new Course({
      ...json,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }
  
  addModule(module) {
    this.modules.push(module)
    this.calculateDuration()
  }
  
  removeModule(moduleId) {
    this.modules = this.modules.filter(m => m.id !== moduleId)
    this.calculateDuration()
  }
  
  calculateDuration() {
    this.duration = this.modules.reduce((total, module) => {
      return total + (module.duration || 0)
    }, 0)
  }
}
