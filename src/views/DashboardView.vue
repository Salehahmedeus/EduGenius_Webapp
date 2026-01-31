<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/infrastructure/api/authApi'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { toast } = useToast()
const user = ref(null)

onMounted(() => {
  const userData = jwtStorage.getUserData()
  if (!userData) {
    router.push('/login')
    return
  }
  user.value = userData
})
</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">
            Logged in as:
            <span class="font-medium text-foreground">{{
              user?.name || user?.email || 'User'
            }}</span>
          </p>
        </CardContent>
      </Card>

      <!-- Placeholder cards for statistics -->
      <Card>
        <CardHeader>
          <CardTitle>Content count</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">0</div>
          <p class="text-xs text-muted-foreground">Uploaded materials</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">0%</div>
          <p class="text-xs text-muted-foreground">Overall completion</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
