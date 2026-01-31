<script setup>
import { useToast } from '@/composables/useToast'
import Toast from './Toast.vue'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div
    class="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]"
  >
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :variant="toast.variant"
      :open="toast.open"
      @close="dismiss(toast.id)"
    >
      <div v-if="toast.title" class="text-sm font-semibold">{{ toast.title }}</div>
      <div v-if="toast.description" class="text-sm opacity-90">{{ toast.description }}</div>
    </Toast>
  </div>
</template>
