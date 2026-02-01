<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useDark, useToggle, useLocalStorage } from '@vueuse/core'
import { Sun, Moon, Menu, X, LogOut } from 'lucide-vue-next'
import { APP_CONSTANTS } from '@/shared/constants/appConstants'
import { Toaster } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { authApi } from '@/infrastructure/api/authApi'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import { useToast } from '@/composables/useToast'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const isAuthRoute = computed(() => {
  const authRoutes = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password']
  return authRoutes.includes(route.path)
})

const showHeader = computed(() => !isAuthRoute.value)
const showSidebar = computed(() => authStore.isLoggedIn && !isAuthRoute.value)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  },
)

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

// Add dark mode back since I accidentally removed it in the previous chunk
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-background font-sans antialiased text-foreground">
    <!-- Mobile Backdrop -->
    <div
      v-if="showSidebar && isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <AppSidebar
      v-if="showSidebar"
      :class="[
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        'fixed md:relative z-50 transition-transform duration-300',
      ]"
      @close="isMobileMenuOpen = false"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-background relative">
      <!-- Header -->
      <header
        v-if="showHeader"
        class="h-16 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30"
      >
        <div class="flex h-full items-center justify-between px-4 md:px-6">
          <div class="flex items-center gap-3">
            <!-- Mobile Toggle -->
            <Button
              v-if="showSidebar"
              variant="ghost"
              size="icon"
              @click="toggleMobileMenu"
              class="md:hidden"
            >
              <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
              <X v-else class="h-5 w-5" />
            </Button>

            <nav class="flex items-center space-x-4">
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
          </div>

          <div class="flex items-center space-x-2 md:space-x-3">
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
                class="hover:text-destructive hidden sm:flex"
              >
                Logout
              </Button>
              <Button
                variant="ghost"
                size="icon"
                @click="handleLogout"
                class="sm:hidden text-muted-foreground hover:text-destructive"
              >
                <LogOut class="h-4 w-4" />
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
