<script setup>
import { ref, onUpdated, onMounted, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { User, Bot } from 'lucide-vue-next'

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const scrollContainer = ref(null)

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

onMounted(scrollToBottom)
onUpdated(scrollToBottom)

const renderMarkdown = (content) => {
  return md.render(content || '')
}
</script>

<template>
  <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
    <div
      v-if="messages.length === 0 && !isLoading"
      class="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 pt-20"
    >
      <div class="rounded-full bg-primary/10 p-4">
        <Bot class="h-10 w-10 text-primary" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-medium">EduGenius AI Tutor</h3>
        <p class="text-sm max-w-sm">
          Ask me anything about your courses, or upload a document to get started.
        </p>
      </div>
    </div>

    <div
      v-for="(msg, index) in messages"
      :key="index"
      class="flex gap-4 group"
      :class="[msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']"
    >
      <!-- Avatar -->
      <div
        class="h-8 w-8 shrink-0 rounded-full flex items-center justify-center border"
        :class="[msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted']"
      >
        <User v-if="msg.role === 'user'" class="h-4 w-4" />
        <Bot v-else class="h-4 w-4" />
      </div>

      <!-- Message Content -->
      <div
        class="max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm"
        :class="[
          msg.role === 'user'
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-card border rounded-tl-none',
        ]"
      >
        <div
          class="prose prose-sm dark:prose-invert break-words max-w-none"
          :class="[msg.role === 'user' ? 'prose-p:text-primary-foreground' : '']"
          v-html="renderMarkdown(msg.content)"
        ></div>

        <!-- Attachment Info if any -->
        <div v-if="msg.file_name" class="mt-2 text-[10px] opacity-70 flex items-center gap-1">
          <span>📎</span>
          <span>{{ msg.file_name }}</span>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="flex gap-4 animate-pulse">
      <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        <Bot class="h-4 w-4 text-muted-foreground" />
      </div>
      <div class="bg-card border rounded-2xl rounded-tl-none px-4 py-3 min-w-[100px]">
        <div class="flex gap-1">
          <div class="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce"></div>
          <div
            class="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]"
          ></div>
          <div
            class="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped overrides if needed */
</style>
