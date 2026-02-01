<script setup>
import { onMounted, computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAiStore } from '@/stores/aiStore'
import { useAuthStore } from '@/stores/authStore'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Settings,
  ClipboardCheck,
  Plus,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const aiStore = useAiStore()

const authStore = useAuthStore()

// Safely get user data
const user = computed(() => authStore.user)

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

const emit = defineEmits(['close'])

const handleNewChat = () => {
  aiStore.clearCurrentChat()
  emit('close')
  if (route.path !== '/ai-tutor') {
    router.push('/ai-tutor')
  }
}

const selectChat = (id) => {
  aiStore.setCurrentChat(id)
  emit('close')
  if (route.path !== '/ai-tutor') {
    router.push('/ai-tutor')
  }
}

const handleDeleteChat = async (id) => {
  if (confirm('Delete this chat?')) {
    try {
      await aiStore.deleteChat(id)
    } catch (e) {
      console.error('Failed to delete chat', e)
    }
  }
}

const handleLogout = () => {
  authStore.clearAuth()
  emit('close')
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
    class="h-full w-64 bg-[#0d0d0d] text-white flex flex-col shrink-0 border-r border-white/10"
  >
    <!-- Header: Brand & New Chat -->
    <div class="p-4 space-y-4">
      <div class="flex items-center px-1">
        <div class="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/logo.png" alt="EduGenius Logo" class="h-full w-full object-contain" />
        </div>
        <span class="ml-2.5 text-base font-bold tracking-tight text-white/90">EduGenius</span>
      </div>

      <Button
        variant="ghost"
        class="w-full justify-start gap-2 h-10 px-3 bg-white/5 hover:bg-white/10 text-white/90 border-transparent transition-all rounded-xl"
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
        <div class="px-2 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Main Menu
        </div>
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/5'
              : 'text-white/60 hover:bg-white/5 hover:text-white',
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span class="ml-3">{{ item.name }}</span>
          <ChevronRight v-if="isActive(item.path)" class="ml-auto h-3 w-3 opacity-50" />
        </RouterLink>
      </div>

      <!-- History Section -->
      <div class="flex-1 flex flex-col overflow-hidden mt-6">
        <div class="px-5 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Recent Chats
        </div>

        <div class="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar pb-4 text-white/80">
          <div v-if="aiStore.isLoadingList" class="p-4 space-y-2">
            <div v-for="i in 5" :key="i" class="h-8 bg-white/5 rounded animate-pulse w-full"></div>
          </div>

          <div
            v-else-if="aiStore.chats.length === 0"
            class="px-2 py-8 text-xs text-white/30 text-center italic"
          >
            No recent chats
          </div>

          <div
            v-for="chat in aiStore.chats"
            :key="chat.id"
            class="group relative flex items-center rounded-lg px-2 py-2.5 text-xs transition-all duration-200 cursor-pointer"
            :class="[
              isChatActive(chat.id)
                ? 'bg-white/10 text-white font-medium shadow-sm'
                : 'text-white/60 hover:bg-white/5 hover:text-white',
            ]"
            @click="selectChat(chat.id)"
          >
            <span class="truncate flex-1 leading-relaxed">
              {{ chat.context_name || 'Untitled Chat' }}
            </span>

            <button
              @click.stop="handleDeleteChat(chat.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
            >
              <Trash2 class="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile Area -->
    <div class="p-4 border-t border-white/5 bg-white/[0.02]">
      <div class="flex items-center group">
        <div
          class="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/10 shrink-0"
        >
          {{ user?.name?.charAt(0) || 'U' }}
        </div>
        <div class="ml-3 flex-1 overflow-hidden">
          <p class="text-xs font-semibold truncate text-white/90">{{ user?.name || 'User' }}</p>
          <p class="text-[10px] text-white/40 truncate">{{ user?.email }}</p>
        </div>
        <button
          @click="handleLogout"
          class="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
          title="Log out"
        >
          <LogOut class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
