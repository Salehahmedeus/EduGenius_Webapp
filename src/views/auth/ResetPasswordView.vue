<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute()
const email = ref('')
const otp = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)
const { toast } = useToast()

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
})

const handleResetPassword = async () => {
  if (password.value !== passwordConfirmation.value) {
    toast({
      title: 'Validation Error',
      description: 'Passwords do not match',
      variant: 'destructive',
    })
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
    toast({
      title: 'Success',
      description: 'Password reset successfully!',
      variant: 'success',
    })
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (e) {
    const message = e.response?.data?.message || e.message || 'Failed to reset password'
    toast({
      title: 'Reset Error',
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
        <CardTitle class="text-2xl">Reset Password</CardTitle>
        <CardDescription> Enter the OTP and your new password. </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
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
