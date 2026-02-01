<script setup>
import { Button } from '@/presentation/components/common/ui'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] gap-4">
    <h1 class="text-4xl font-bold tracking-tight">EduGenius</h1>
    <p class="text-lg text-muted-foreground">Your AI-powered learning companion.</p>
    <div class="flex gap-4">
      <Button as-child>
        <router-link to="/login">Get Started</router-link>
      </Button>
      <Button variant="outline" as-child>
        <router-link to="/about">Learn More</router-link>
      </Button>
    </div>
  </div>
</template>
