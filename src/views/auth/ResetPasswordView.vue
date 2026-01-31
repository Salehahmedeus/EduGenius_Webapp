<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute()
const email = ref('')
const otp = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
})

const handleResetPassword = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    await authApi.resetPassword({
      email: email.value,
      otp: otp.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    success.value = 'Password reset successfully!'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to reset password'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-muted/20">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Reset Password</CardTitle>
        <CardDescription> Enter the OTP and your new password. </CardDescription>
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
          <Input id="email" type="email" v-model="email" readonly class="bg-muted" />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input id="otp" type="text" placeholder="123456" v-model="otp" required />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" v-model="password" required />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>
          <Input
            id="passwordConfirmation"
            type="password"
            v-model="passwordConfirmation"
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" :disabled="isLoading" @click="handleResetPassword">
          <span v-if="isLoading">Resetting...</span>
          <span v-else>Reset Password</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
