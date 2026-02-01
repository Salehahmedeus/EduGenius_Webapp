<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute()
const email = ref('')
const otp = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)
const { toast } = useToast()

// onMounted merged below

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
    const message = getErrorMessage(e)
    toast({
      title: 'Reset Error',
      description: message,
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

const resendTimer = ref(60) // Start with 60s cooldown on mount
let timerInterval = null

const startResendTimer = () => {
  resendTimer.value = 60
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }, 1000)
}

const handleResendOtp = async () => {
  if (!email.value) {
    toast({
      title: 'Error',
      description: 'Email is required to resend OTP',
      variant: 'destructive',
    })
    return
  }

  isLoading.value = true
  try {
    // Re-trigger forgot password to resend OTP
    await authApi.forgotPassword({ email: email.value })
    toast({
      title: 'Success',
      description: 'A new OTP has been sent to your email.',
      variant: 'success',
    })
    startResendTimer()
  } catch (e) {
    const message = e.response?.data?.message || e.message || 'Failed to resend OTP'
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
  startResendTimer()
})
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
      <div class="px-6 pb-6 text-center text-sm">
        Didn't receive the code?
        <button
          @click="handleResendOtp"
          class="underline underline-offset-4 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading || resendTimer > 0"
        >
          <span v-if="resendTimer > 0">Resend in {{ resendTimer }}s</span>
          <span v-else>Resend</span>
        </button>
      </div>
    </Card>
  </div>
</template>
