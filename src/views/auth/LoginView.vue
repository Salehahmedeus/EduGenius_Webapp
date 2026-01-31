<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/infrastructure/api/authApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    await authApi.login({ email: email.value, password: password.value })
    router.push('/dashboard/home')
  } catch (e) {
    error.value = e.message || 'Failed to login'
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
        <div v-if="error" class="text-sm text-destructive font-medium">
          {{ error }}
        </div>
        <div class="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="password">Password</Label>
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
