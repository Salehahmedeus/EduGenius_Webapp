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
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const handleForgotPassword = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await authApi.forgotPassword({ email: email.value })
    success.value = 'OTP sent to your email!'
    setTimeout(() => {
      router.push({ path: '/reset-password', query: { email: email.value } })
    }, 1500)
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to send OTP'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-muted/20">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset OTP.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div v-if="error" class="text-sm text-destructive font-medium">
          {{ error }}
        </div>
        <div v-if="success" class="text-sm text-green-600 font-medium">
          {{ success }}
        </div>
        <div class="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" :disabled="isLoading" @click="handleForgotPassword">
          <span v-if="isLoading">Sending...</span>
          <span v-else>Send OTP</span>
        </Button>
      </CardFooter>
      <div class="px-6 pb-6 text-center text-sm">
        Remember your password?
        <router-link to="/login" class="underline underline-offset-4 hover:text-primary">
          Sign in
        </router-link>
      </div>
    </Card>
  </div>
</template>
