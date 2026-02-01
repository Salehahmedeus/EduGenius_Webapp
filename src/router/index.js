import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../presentation/views/dashboard/HomeView.vue'
import LoginView from '../presentation/views/auth/LoginView.vue'
import RegisterView from '../presentation/views/auth/RegisterView.vue'
import VerifyOtpView from '../presentation/views/auth/VerifyOtpView.vue'
import ForgotPasswordView from '../presentation/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '../presentation/views/auth/ResetPasswordView.vue'
import DashboardView from '../presentation/views/dashboard/DashboardView.vue'
import QuizzesView from '../presentation/views/quizzes/QuizzesView.vue'
import AiTutorView from '../presentation/views/tutor/AiTutorView.vue'
import MaterialsView from '../presentation/views/content/MaterialsView.vue'
import QuizTakingView from '../presentation/views/quizzes/QuizTakingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: VerifyOtpView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/dashboard/home',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/quizzes',
      name: 'quizzes',
      component: QuizzesView,
    },
    {
      path: '/quiz/:id',
      name: 'quiz-taking',
      component: QuizTakingView,
    },
    {
      path: '/ai-tutor',
      name: 'ai-tutor',
      component: AiTutorView,
    },
    {
      path: '/materials',
      name: 'materials',
      component: MaterialsView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../presentation/views/common/AboutView.vue'),
    },
  ],
})

export default router
