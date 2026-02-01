<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/infrastructure/api/authApi'
import { Button, Input, Label } from '@/presentation/components/common/ui'
import { ArrowLeft } from 'lucide-vue-next'
import AuthBackground from '@/presentation/components/common/AuthBackground.vue'
import { useToast } from '@/presentation/composables/useToast'
import { getErrorMessage } from '@/shared/middleware/errorBoundary'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/components/common/ui/card'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const { toast } = useToast()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast({
      title: 'Validation Error',
      description: 'Email and password are required',
      variant: 'destructive',
    })
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast({
      title: 'Validation Error',
      description: 'Please enter a valid email address',
      variant: 'destructive',
    })
    return
  }

  isLoading.value = true

  try {
    await authApi.login({ email: email.value, password: password.value })
    toast({
      title: 'Success',
      description: 'Logged in successfully',
      variant: 'success',
    })
    router.push('/dashboard/home')
  } catch (e) {
    const message = getErrorMessage(e)
    toast({
      title: 'Login Error',
      description: message,
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen relative overflow-hidden">
    <AuthBackground />
    <!-- Back to Landing Button -->
    <Button
      variant="ghost"
      size="icon"
      class="absolute top-6 left-6 z-10 rounded-full hover:bg-background/80"
      @click="router.push('/')"
      title="Back to Home"
    >
      <ArrowLeft class="h-5 w-5" />
    </Button>
    <Card
      class="w-full max-w-sm relative z-10 backdrop-blur-sm bg-card/95 border-primary/10 shadow-2xl"
    >
      <CardHeader>
        <CardTitle class="text-2xl">Login</CardTitle>
        <CardDescription> Enter your email below to login to your account. </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <router-link
              to="/forgot-password"
              class="text-sm underline underline-offset-4 hover:text-primary"
            >
              Forgot password?
            </router-link>
          </div>
          <Input id="password" type="password" v-model="password" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" :disabled="isLoading" @click="handleLogin">
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Sign in</span>
        </Button>
      </CardFooter>
      <div class="px-6 pb-6 text-center text-sm">
        Don't have an account?
        <router-link to="/register" class="underline underline-offset-4 hover:text-primary">
          Sign up
        </router-link>
      </div>
    </Card>
  </div>
</template>
