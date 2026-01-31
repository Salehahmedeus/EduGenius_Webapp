<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <header class="border-b">
      <div class="container flex h-16 items-center px-4">
        <nav class="flex items-center space-x-4 lg:space-x-6">
          <RouterLink to="/" class="text-sm font-medium transition-colors hover:text-primary">
            Home
          </RouterLink>
          <RouterLink
            to="/login"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Register
          </RouterLink>
        </nav>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
