export class IContentRepository {
  async saveCourse(course) {
    throw new Error('Method not implemented')
  }
  
  async getCourse(courseId) {
    throw new Error('Method not implemented')
  }
  
  async getCourses(filters = {}) {
    throw new Error('Method not implemented')
  }
  
  async deleteCourse(courseId) {
    throw new Error('Method not implemented')
  }
  
  async saveModule(module) {
    throw new Error('Method not implemented')
  }
  
  async getModule(moduleId) {
    throw new Error('Method not implemented')
  }
  
  async deleteModule(moduleId) {
    throw new Error('Method not implemented')
  }
  
  async saveLesson(lesson) {
    throw new Error('Method not implemented')
  }
  
  async getLesson(lessonId) {
    throw new Error('Method not implemented')
  }
  
  async deleteLesson(lessonId) {
    throw new Error('Method not implemented')
  }
  
  async uploadMedia(file) {
    throw new Error('Method not implemented')
  }
  
  async getContentTree(courseId) {
    throw new Error('Method not implemented')
  }
}
