<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAiStore } from '@/stores/aiStore'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Settings,
  GraduationCap,
  ClipboardCheck,
  Plus,
  MessageSquare,
  LogOut,
  Trash2,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const aiStore = useAiStore()
const user = computed(() => jwtStorage.getUserData())

const navItems = [
  { name: 'Dashboard', path: '/dashboard/home', icon: LayoutDashboard },
  { name: 'Quizzes', path: '/quizzes', icon: ClipboardCheck },
  { name: 'Materials', path: '/materials', icon: FileText },
  { name: 'AI Tutor', path: '/ai-tutor', icon: BrainCircuit },
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path
}

const isChatActive = (id) => {
  return route.path === '/ai-tutor' && aiStore.currentChatId === id
}

const handleNewChat = () => {
  aiStore.clearCurrentChat()
  if (route.path !== '/ai-tutor') {
    router.push('/ai-tutor')
  }
}

const selectChat = (id) => {
  aiStore.setCurrentChat(id)
  if (route.path !== '/ai-tutor') {
    router.push('/ai-tutor')
  }
}

const handleDeleteChat = async (id) => {
  if (confirm('Delete this chat?')) {
    await aiStore.deleteChat(id)
  }
}

const handleLogout = () => {
  jwtStorage.clearAll()
  router.push('/login')
}

onMounted(() => {
  if (jwtStorage.getAccessToken()) {
    aiStore.loadChats()
  }
})
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card flex flex-col transition-all duration-300"
  >
    <!-- Header: Brand & New Chat -->
    <div class="p-4 space-y-4">
      <div class="flex items-center px-1">
        <GraduationCap class="h-6 w-6 text-primary shrink-0" />
        <span class="ml-2 text-base font-bold tracking-tight text-foreground">EduGenius</span>
      </div>

      <Button
        variant="outline"
        class="w-full justify-start gap-2 h-10 px-3 border-dashed hover:bg-accent hover:text-accent-foreground"
        @click="handleNewChat"
      >
        <Plus class="h-4 w-4" />
        <span class="text-sm font-medium">New chat</span>
      </Button>
    </div>

    <!-- Navigation Section -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- App Tabs -->
      <div class="px-3 py-2 space-y-0.5">
        <div
          class="px-2 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70"
        >
          Main Menu
        </div>
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0 transition-colors" />
          <span class="ml-3">{{ item.name }}</span>
        </RouterLink>
      </div>

      <!-- History Section -->
      <div class="flex-1 flex flex-col overflow-hidden mt-6">
        <div
          class="px-5 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70"
        >
          Your chats
        </div>

        <div class="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
          <div v-if="aiStore.isLoadingList" class="p-4 space-y-2">
            <div v-for="i in 5" :key="i" class="h-8 bg-muted rounded animate-pulse w-full"></div>
          </div>

          <div
            v-else-if="aiStore.chats.length === 0"
            class="px-2 py-8 text-xs text-muted-foreground text-center opacity-50"
          >
            No recent chats
          </div>

          <div
            v-for="chat in aiStore.chats"
            :key="chat.id"
            class="group relative flex items-center rounded-lg px-2 py-2.5 text-xs transition-all duration-200 cursor-pointer"
            :class="[
              isChatActive(chat.id)
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ]"
            @click="selectChat(chat.id)"
          >
            <MessageSquare class="h-3.5 w-3.5 shrink-0" />
            <span class="ml-3 truncate flex-1">
              {{ chat.context_name || 'Untitled Chat' }}
            </span>

            <button
              @click.stop="handleDeleteChat(chat.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
            >
              <Trash2 class="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile Area -->
    <div class="p-4 border-t bg-muted/20">
      <div class="flex items-center group">
        <div
          class="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold ring-1 ring-border shrink-0"
        >
          {{ user?.name?.charAt(0) || 'U' }}
        </div>
        <div class="ml-3 flex-1 overflow-hidden">
          <p class="text-xs font-semibold truncate text-foreground">{{ user?.name || 'User' }}</p>
          <p class="text-[10px] text-muted-foreground truncate">{{ user?.email }}</p>
        </div>
        <button
          @click="handleLogout"
          class="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
          title="Log out"
        >
          <LogOut class="h-4 w-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.1);
  border-radius: 9999px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.3);
}
</style>
