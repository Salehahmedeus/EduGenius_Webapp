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
const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  isLoading.value = true

  try {
    await authApi.register({ name: name.value, email: email.value, password: password.value })
    // Assuming register logs in automatically or redirects to login.
    // Based on many flows, it might redirect to login or dashboard.
    // For now, let's redirect to login to be safe, or dashboard if token is set.
    router.push('/login')
  } catch (e) {
    error.value = e.message || 'Failed to create account'
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
        <div v-if="error" class="text-sm text-destructive font-medium">
          {{ error }}
        </div>
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
