<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { authApi } from '@/infrastructure/api/authApi'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const isLoggedIn = computed(() => !!jwtStorage.getAccessToken())
const isAuthRoute = computed(() => {
  const authRoutes = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password']
  return authRoutes.includes(route.path)
})

const showHeader = computed(() => !isAuthRoute.value)

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
  <div class="min-h-screen bg-background font-sans antialiased">
    <header v-if="showHeader" class="border-b">
      <div class="container flex h-16 items-center justify-between px-4 mx-auto">
        <nav class="flex items-center space-x-4 lg:space-x-6">
          <RouterLink to="/" class="text-sm font-medium transition-colors hover:text-primary">
            Home
          </RouterLink>
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
          <template v-else>
            <RouterLink
              to="/dashboard/home"
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </RouterLink>
          </template>
        </nav>

        <div v-if="isLoggedIn">
          <Button variant="ghost" size="sm" @click="handleLogout"> Logout </Button>
        </div>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
    <Toaster />
  </div>
</template>
