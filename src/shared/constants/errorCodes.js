export const ERROR_CODES = {
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_001',
    TOKEN_EXPIRED: 'AUTH_002',
    TOKEN_INVALID: 'AUTH_003',
    NO_TOKEN: 'AUTH_004',
    REFRESH_FAILED: 'AUTH_005'
  },
  API: {
    NETWORK_ERROR: 'API_001',
    SERVER_ERROR: 'API_002',
    NOT_FOUND: 'API_003',
    VALIDATION_ERROR: 'API_004',
    RATE_LIMITED: 'API_005'
  },
  TUTOR: {
    CONVERSATION_NOT_FOUND: 'TUTOR_001',
    SEND_FAILED: 'TUTOR_002',
    CONTEXT_LIMIT: 'TUTOR_003'
  },
  CONTENT: {
    COURSE_NOT_FOUND: 'CONTENT_001',
    LESSON_NOT_FOUND: 'CONTENT_002',
    UPLOAD_FAILED: 'CONTENT_003',
    INVALID_FORMAT: 'CONTENT_004'
  },
  QUIZ: {
    QUIZ_NOT_FOUND: 'QUIZ_001',
    SUBMIT_FAILED: 'QUIZ_002',
    GRADE_FAILED: 'QUIZ_003',
    TIME_EXPIRED: 'QUIZ_004'
  }
}

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.AUTH.TOKEN_EXPIRED]: 'Session expired. Please login again.',
  [ERROR_CODES.AUTH.TOKEN_INVALID]: 'Invalid session. Please login again.',
  [ERROR_CODES.AUTH.NO_TOKEN]: 'No authentication token found',
  [ERROR_CODES.AUTH.REFRESH_FAILED]: 'Failed to refresh session',
  [ERROR_CODES.API.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ERROR_CODES.API.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_CODES.API.NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.API.VALIDATION_ERROR]: 'Invalid data provided',
  [ERROR_CODES.API.RATE_LIMITED]: 'Too many requests. Please try again later.',
  [ERROR_CODES.TUTOR.CONVERSATION_NOT_FOUND]: 'Conversation not found',
  [ERROR_CODES.TUTOR.SEND_FAILED]: 'Failed to send message',
  [ERROR_CODES.TUTOR.CONTEXT_LIMIT]: 'Conversation context limit reached',
  [ERROR_CODES.CONTENT.COURSE_NOT_FOUND]: 'Course not found',
  [ERROR_CODES.CONTENT.LESSON_NOT_FOUND]: 'Lesson not found',
  [ERROR_CODES.CONTENT.UPLOAD_FAILED]: 'Failed to upload file',
  [ERROR_CODES.CONTENT.INVALID_FORMAT]: 'Invalid file format',
  [ERROR_CODES.QUIZ.QUIZ_NOT_FOUND]: 'Quiz not found',
  [ERROR_CODES.QUIZ.SUBMIT_FAILED]: 'Failed to submit quiz',
  [ERROR_CODES.QUIZ.GRADE_FAILED]: 'Failed to grade quiz',
  [ERROR_CODES.QUIZ.TIME_EXPIRED]: 'Quiz time has expired'
}
