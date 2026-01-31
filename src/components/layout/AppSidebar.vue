<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Settings,
  HelpCircle,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-vue-next'

const route = useRoute()

const menuItems = [
  { name: 'Dashboard', path: '/dashboard/home', icon: LayoutDashboard },
  { name: 'Quizzes', path: '/quizzes', icon: ClipboardCheck },
  { name: 'Materials', path: '/materials', icon: FileText },
  { name: 'AI Tutor', path: '/ai-tutor', icon: BrainCircuit },
  { name: 'Settings', path: '/settings', icon: Settings },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
    <div class="flex h-full flex-col overflow-y-auto px-3 py-4">
      <!-- Logo / Brand Area -->
      <div class="mb-10 flex items-center px-2 py-4">
        <GraduationCap class="h-8 w-8 text-primary shrink-0" />
        <span class="ml-3 text-xl font-bold tracking-tight text-foreground">EduGenius</span>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          ]"
        >
          <component
            :is="item.icon"
            class="h-5 w-5 shrink-0 transition-colors"
            :class="[
              isActive(item.path)
                ? 'text-primary-foreground'
                : 'text-muted-foreground group-hover:text-accent-foreground',
            ]"
          />
          <span class="ml-3">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom Items -->
      <div class="mt-auto border-t pt-4 space-y-1">
        <RouterLink
          to="/help"
          class="flex items-center rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        >
          <HelpCircle class="h-5 w-5 shrink-0" />
          <span class="ml-3">Help & Support</span>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>
