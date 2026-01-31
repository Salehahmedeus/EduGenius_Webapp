export class Module {
  constructor(data = {}) {
    this.id = data.id || null
    this.courseId = data.courseId || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.lessons = data.lessons || []
    this.order = data.order || 0
    this.duration = data.duration || 0
    this.isPublished = data.isPublished !== undefined ? data.isPublished : false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
  
  toJSON() {
    return {
      id: this.id,
      courseId: this.courseId,
      title: this.title,
      description: this.description,
      lessons: this.lessons,
      order: this.order,
      duration: this.duration,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
  
  static fromJSON(json) {
    return new Module({
      ...json,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }
  
  addLesson(lesson) {
    this.lessons.push(lesson)
    this.calculateDuration()
  }
  
  removeLesson(lessonId) {
    this.lessons = this.lessons.filter(l => l.id !== lessonId)
    this.calculateDuration()
  }
  
  calculateDuration() {
    this.duration = this.lessons.reduce((total, lesson) => {
      return total + (lesson.duration || 0)
    }, 0)
  }
}
