<script setup>
import { Label } from 'radix-vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

defineProps({
  as: { type: String, default: 'label' },
})
</script>

<template>
  <Label :as="as" :class="cn(labelVariants(), $attrs.class)">
    <slot />
  </Label>
</template>
