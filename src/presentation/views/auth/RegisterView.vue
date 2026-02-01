<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/infrastructure/api/authApi'
import { Button, Input, Label } from '@/presentation/components/common/ui'
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
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)
const { toast } = useToast()

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    toast({
      title: 'Validation Error',
      description: 'All fields are required',
      variant: 'destructive',
    })
    return
  }

  if (password.value !== passwordConfirmation.value) {
    toast({
      title: 'Error',
      description: 'Passwords do not match',
      variant: 'destructive',
    })
    return
  }

  isLoading.value = true

  try {
    await authApi.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    toast({
      title: 'Success',
      description: 'Account created! Please verify your email.',
      variant: 'success',
    })
    // Redirect to OTP verification
    router.push({ path: '/verify-otp', query: { email: email.value } })
  } catch (e) {
    const message = getErrorMessage(e)
    console.error('Registration failed:', e)

    toast({
      title: 'Registration Error',
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
        <CardTitle class="text-xl">Sign Up</CardTitle>
        <CardDescription> Enter your information to create an account </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" v-model="name" required />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
        </div>
        <div class="grid gap-2">
          <Label htmlFor="password">Password</Label>
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
        <Button class="w-full" :disabled="isLoading" @click="handleRegister">
          <span v-if="isLoading">Creating account...</span>
          <span v-else>Create account</span>
        </Button>
      </CardFooter>
      <div class="px-6 pb-6 text-center text-sm">
        Already have an account?
        <router-link to="/login" class="underline underline-offset-4 hover:text-primary">
          Sign in
        </router-link>
      </div>
    </Card>
  </div>
</template>
