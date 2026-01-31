<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useDark, useToggle, useLocalStorage } from '@vueuse/core'
import { Sun, Moon } from 'lucide-vue-next'
import { APP_CONSTANTS } from '@/shared/constants/appConstants'
import { Toaster } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { authApi } from '@/infrastructure/api/authApi'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import { useToast } from '@/composables/useToast'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const accessToken = useLocalStorage(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, null)

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const isLoggedIn = computed(() => !!accessToken.value)
const isAuthRoute = computed(() => {
  const authRoutes = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password']
  return authRoutes.includes(route.path)
})

const showHeader = computed(() => !isAuthRoute.value)
const showSidebar = computed(() => isLoggedIn.value && !isAuthRoute.value)

const handleLogout = async () => {
  try {
    await authApi.logout()
    toast({
      title: 'Success',
      description: 'Logged out successfully',
      variant: 'success',
    })
    router.push('/login')
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to logout',
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-background font-sans antialiased">
    <!-- Sidebar -->
    <AppSidebar v-if="showSidebar" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-background">
      <!-- Header -->
      <header
        v-if="showHeader"
        class="h-16 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30"
      >
        <div class="flex h-full items-center justify-between px-6">
          <nav class="flex items-center space-x-4 lg:space-x-6">
            <template v-if="!showSidebar">
              <RouterLink to="/" class="text-sm font-medium transition-colors hover:text-primary">
                Home
              </RouterLink>
            </template>

            <template v-if="!isLoggedIn">
              <RouterLink
                to="/login"
                class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Register
              </RouterLink>
            </template>
          </nav>

          <div class="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              @click="toggleDark()"
              class="rounded-full w-9 h-9"
              aria-label="Toggle dark mode"
            >
              <Sun v-if="isDark" class="h-4 w-4" />
              <Moon v-else class="h-4 w-4" />
            </Button>

            <div v-if="isLoggedIn">
              <Button
                variant="ghost"
                size="sm"
                @click="handleLogout"
                class="hover:text-destructive"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-hidden relative">
        <RouterView />
      </main>
    </div>

    <Toaster />
  </div>
</template>
