<script setup>
import { cn } from '@/shared/lib/utils'
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground', $attrs.class)">
    <slot />
  </p>
</template>
