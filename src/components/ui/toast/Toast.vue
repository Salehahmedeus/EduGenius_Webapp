<script setup>
import { computed } from 'vue'
import { cn } from '@/shared/lib/utils'
import { cva } from 'class-variance-authority'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-500 bg-green-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const props = defineProps({
  variant: { type: String, default: 'default' },
  open: { type: Boolean, default: true },
})

defineEmits(['close'])
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="open" :class="cn(toastVariants({ variant }), $attrs.class)" role="alert">
      <div class="grid gap-1">
        <slot />
      </div>
      <button
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </Transition>
</template>
