<script setup>
import { cn } from '@/shared/lib/utils'
</script>

<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', $attrs.class)">
    <slot />
  </div>
</template>
