export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.edudashboard.com'

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify'
  },
  tutor: {
    conversations: '/tutor/conversations',
    messages: '/tutor/messages',
    sendMessage: '/tutor/send',
    deleteConversation: '/tutor/conversations/:id'
  },
  content: {
    courses: '/content/courses',
    lessons: '/content/lessons',
    modules: '/content/modules',
    upload: '/content/upload',
    tree: '/content/tree'
  },
  dashboard: {
    stats: '/dashboard/stats',
    progress: '/dashboard/progress',
    report: '/dashboard/report',
    activity: '/dashboard/activity'
  },
  quizzes: {
    list: '/quizzes',
    create: '/quizzes',
    submit: '/quizzes/:id/submit',
    results: '/quizzes/:id/results',
    grade: '/quizzes/:id/grade'
  }
}
