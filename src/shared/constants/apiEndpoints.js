export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://edugenius-g6jn.onrender.com/api'

export const API_ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
    verifyOtp: '/otp/verify',
    sendOtp: '/otp/send',
    me: '/me',
    logout: '/logout',
    forgotPassword: '/password/email',
    resetPassword: '/password/reset',
  },
  ai: {
    history: '/ai/history',
    ask: '/ai/ask',
    chats: '/ai/chats',
    chat: '/ai/chats/:id',
  },
  materials: {
    list: '/materials',
    upload: '/materials/upload',
    search: '/materials/search',
    delete: '/materials/:id',
  },
  dashboard: {
    home: '/dashboard/home',
    report: '/dashboard/report',
  },
  quiz: {
    generate: '/quiz/generate',
    submit: '/quiz/submit',
    all: '/quiz/all',
    detail: '/quiz/:id',
  },
}
