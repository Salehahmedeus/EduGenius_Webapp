<script setup>
import { computed } from 'vue'
import { Plus, MessageSquare, Trash2, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps({
  chats: {
    type: Array,
    required: true,
  },
  currentChatId: {
    type: [Number, String],
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'new', 'delete'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>

<template>
  <div class="flex h-full flex-col border-r bg-muted/10">
    <!-- Header: New Chat -->
    <div class="p-4 border-b">
      <Button
        class="w-full justify-start gap-2"
        variant="outline"
        @click="emit('new')"
        :disabled="isLoading"
      >
        <Plus class="h-4 w-4" />
        New Chat
      </Button>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <div v-if="chats.length === 0" class="py-10 text-center text-sm text-muted-foreground">
        No recent chats
      </div>

      <div
        v-for="chat in chats"
        :key="chat.id"
        class="group relative flex items-center rounded-lg px-3 py-3 transition-colors cursor-pointer"
        :class="[
          currentChatId === chat.id
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'hover:bg-accent text-muted-foreground hover:text-accent-foreground',
        ]"
        @click="emit('select', chat.id)"
      >
        <MessageSquare class="h-4 w-4 shrink-0" />
        <div class="ml-3 flex-1 overflow-hidden">
          <div class="truncate font-medium text-sm">
            {{ chat.context_name || 'Untitled Chat' }}
          </div>
          <div class="text-[10px] opacity-70">
            {{ formatDate(chat.updated_at) }}
          </div>
        </div>

        <!-- Delete Button (Visible on hover) -->
        <button
          class="ml-2 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
          @click.stop="emit('delete', chat.id)"
        >
          <Trash2 class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
