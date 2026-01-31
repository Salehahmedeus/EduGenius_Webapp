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
const isLoading = ref(false)
const error = ref('')
const success = ref('')

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
})

const handleVerifyOtp = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await authApi.verifyOtp({ email: email.value, otp: otp.value })
    success.value = 'Email verified successfully!'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to verify OTP'
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
        <a href="#" class="underline underline-offset-4 hover:text-primary"> Resend </a>
      </div>
    </Card>
  </div>
</template>
