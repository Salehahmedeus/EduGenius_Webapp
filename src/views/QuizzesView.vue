<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Quizzes</h1>
      <p class="text-muted-foreground mt-2">Manage and take your educational quizzes here.</p>
    </div>

    <div class="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col items-center justify-center py-10 text-center">
            <div class="rounded-full bg-muted p-3 mb-4">
              <span class="text-2xl">📝</span>
            </div>
            <h3 class="text-lg font-semibold">No quizzes available yet</h3>
            <p class="text-sm text-muted-foreground max-w-xs mt-1">
              Check back soon for new quizzes generated from your learning materials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
