import { QuizAttempt } from '@/core/entities/quizzes/QuizAttempt'
import { Answer } from '@/core/entities/quizzes/Answer'

export class QuizGradingService {
  gradeQuiz(quiz, attempt) {
    let totalPoints = 0
    let earnedPoints = 0
    const answers = []
    
    quiz.questions.forEach(question => {
      totalPoints += question.points
      
      const userAnswer = attempt.getAnswer(question.id)
      
      if (!userAnswer) {
        answers.push(new Answer({
          questionId: question.id,
          answer: null,
          isCorrect: false,
          pointsEarned: 0
        }))
        return
      }
      
      const isCorrect = this.checkAnswer(question, userAnswer.answer)
      const pointsEarned = isCorrect ? question.points : 0
      
      earnedPoints += pointsEarned
      
      answers.push(new Answer({
        questionId: question.id,
        answer: userAnswer.answer,
        isCorrect,
        pointsEarned
      }))
    })
    
    const score = earnedPoints
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = percentage >= quiz.passingScore
    
    return {
      answers,
      score,
      percentage,
      passed
    }
  }
  
  checkAnswer(question, userAnswer) {
    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return question.correctAnswer === userAnswer
      
      case 'short_answer':
        return this.normalizeString(userAnswer) === this.normalizeString(question.correctAnswer)
      
      default:
        return false
    }
  }
  
  normalizeString(str) {
    if (!str) return ''
    return str.toString().toLowerCase().trim()
  }
  
  calculateGrade(percentage) {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }
}
