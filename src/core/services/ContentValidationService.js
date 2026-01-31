export class ContentValidationService {
  validateCourse(course) {
    const errors = []
    
    if (!course.title || course.title.trim() === '') {
      errors.push('Course title is required')
    }
    
    if (!course.description || course.description.trim() === '') {
      errors.push('Course description is required')
    }
    
    if (course.modules.length === 0) {
      errors.push('Course must have at least one module')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateModule(module) {
    const errors = []
    
    if (!module.title || module.title.trim() === '') {
      errors.push('Module title is required')
    }
    
    if (module.lessons.length === 0) {
      errors.push('Module must have at least one lesson')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateLesson(lesson) {
    const errors = []
    
    if (!lesson.title || lesson.title.trim() === '') {
      errors.push('Lesson title is required')
    }
    
    if (!lesson.content || lesson.content.trim() === '') {
      errors.push('Lesson content is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateQuiz(quiz) {
    const errors = []
    
    if (!quiz.title || quiz.title.trim() === '') {
      errors.push('Quiz title is required')
    }
    
    if (quiz.questions.length === 0) {
      errors.push('Quiz must have at least one question')
    }
    
    quiz.questions.forEach((question, index) => {
      const qErrors = this.validateQuestion(question)
      qErrors.forEach(err => {
        errors.push(`Question ${index + 1}: ${err}`)
      })
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateQuestion(question) {
    const errors = []
    
    if (!question.question || question.question.trim() === '') {
      errors.push('Question text is required')
    }
    
    if (question.type === 'multiple_choice') {
      if (!question.options || question.options.length < 2) {
        errors.push('Multiple choice questions must have at least 2 options')
      }
      
      if (question.correctAnswer === null || question.correctAnswer === undefined) {
        errors.push('Correct answer is required')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
