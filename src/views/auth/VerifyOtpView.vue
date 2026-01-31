<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authApi } from '@/infrastructure/api/authApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/composables/useToast'
import { getErrorMessage } from '@/shared/middleware/errorBoundary'
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
const isLoading = ref(false)
const { toast } = useToast()

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
})

const handleVerifyOtp = async () => {
  isLoading.value = true

  try {
    await authApi.verifyOtp({ email: email.value, otp: otp.value })
    toast({
      title: 'Success',
      description: 'Email verified successfully!',
      variant: 'success',
    })
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (e) {
    const message = getErrorMessage(e)
    toast({
      title: 'Verification Error',
      description: message,
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
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
    await authApi.resendOtp({ email: email.value })
    toast({
      title: 'Success',
      description: 'A new OTP has been sent to your email.',
      variant: 'success',
    })
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
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-muted/20">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Verify OTP</CardTitle>
        <CardDescription> Enter the OTP sent to your email address. </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input id="otp" type="text" placeholder="123456" v-model="otp" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" :disabled="isLoading" @click="handleVerifyOtp">
          <span v-if="isLoading">Verifying...</span>
          <span v-else>Verify OTP</span>
        </Button>
      </CardFooter>
      <div class="px-6 pb-6 text-center text-sm">
        Didn't receive the code?
        <button
          @click="handleResendOtp"
          class="underline underline-offset-4 hover:text-primary transition-colors disabled:opacity-50"
          :disabled="isLoading"
        >
          Resend
        </button>
      </div>
    </Card>
  </div>
</template>
