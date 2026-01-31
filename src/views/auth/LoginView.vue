<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/infrastructure/api/authApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/composables/useToast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
    const message = e.response?.data?.message || e.message || 'Failed to login'
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
  <div class="flex items-center justify-center min-h-screen bg-muted/20">
    <Card class="w-full max-w-sm">
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
