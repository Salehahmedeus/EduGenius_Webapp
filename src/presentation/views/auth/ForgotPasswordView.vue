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
const isLoading = ref(false)
const { toast } = useToast()

const handleForgotPassword = async () => {
  isLoading.value = true

  try {
    await authApi.forgotPassword({ email: email.value })
    toast({
      title: 'Success',
      description: 'OTP sent to your email!',
      variant: 'success',
    })
    setTimeout(() => {
      router.push({ path: '/reset-password', query: { email: email.value } })
    }, 1500)
  } catch (e) {
    const message = getErrorMessage(e)
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
        <CardTitle class="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset OTP.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
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
