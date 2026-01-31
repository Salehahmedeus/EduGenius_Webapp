export const APP_CONSTANTS = {
  APP_NAME: 'Edu Dashboard',
  VERSION: '1.0.0',
  
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'edu_access_token',
    REFRESH_TOKEN: 'edu_refresh_token',
    GEMINI_KEY: 'edu_gemini_key',
    USER_DATA: 'edu_user_data',
    THEME: 'edu_theme',
    LANGUAGE: 'edu_language'
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  
  QUIZ: {
    DEFAULT_TIME_LIMIT: 30,
    PASSING_SCORE: 70
  },
  
  TUTOR: {
    MAX_CONTEXT_LENGTH: 10,
    MAX_MESSAGE_LENGTH: 4000
  },
  
  FILE: {
    MAX_UPLOAD_SIZE: 10 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    TUTOR_CHAT: '/tutor/chat',
    CONVERSATIONS: '/tutor/conversations',
    COURSES: '/content/courses',
    LESSON_EDITOR: '/content/lessons/:id',
    QUIZZES: '/quizzes',
    QUIZ_TAKE: '/quizzes/:id/take',
    QUIZ_RESULTS: '/quizzes/:id/results'
  }
}
