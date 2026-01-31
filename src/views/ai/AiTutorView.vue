<script setup>
import { ref, onMounted, watch } from 'vue'
import { aiApi } from '@/infrastructure/api/aiApi'
import { useAiStore } from '@/stores/aiStore'
import { useToast } from '@/composables/useToast'
import AiChatWindow from '@/components/ai/AiChatWindow.vue'
import AiMessageInput from '@/components/ai/AiMessageInput.vue'

const { toast } = useToast()
const aiStore = useAiStore()

const isSending = ref(false)

// Proactively load history if a chat is selected but messages are missing (e.g. on refresh/mount)
onMounted(() => {
  if (aiStore.currentChatId && aiStore.messages.length === 0) {
    aiStore.setCurrentChat(aiStore.currentChatId)
  }
})

// Ensure view stays synced if sidebar selection changes while already on this view
watch(
  () => aiStore.currentChatId,
  (newId) => {
    if (newId) {
      aiStore.setCurrentChat(newId)
    }
  },
)

const handleSendMessage = async ({ query, file }) => {
  isSending.value = true

  // Optimistically add user message to UI
  const tempUserMsg = {
    role: 'user',
    content: query,
    file_name: file ? file.name : null,
  }
  aiStore.messages.push(tempUserMsg)

  try {
    const formData = new FormData()
    formData.append('query', query)
    if (aiStore.currentChatId) {
      formData.append('conversation_id', aiStore.currentChatId)
    }
    if (file) {
      formData.append('file', file)
    }

    const response = await aiApi.ask(formData)

    // Update conversation ID if it's a new chat
    if (!aiStore.currentChatId && response.conversation_id) {
      aiStore.currentChatId = response.conversation_id
      await aiStore.loadChats() // Refresh global sidebar to show new chat
    }

    // Add AI response to messages
    if (response.response) {
      aiStore.messages.push({
        role: 'assistant',
        content: response.response,
      })
    }
  } catch (e) {
    toast({
      title: 'AI Error',
      description: 'Failed to get response from AI Tutor',
      variant: 'destructive',
    })
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden bg-background">
    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-muted/5">
      <AiChatWindow :messages="aiStore.messages" :isLoading="isSending || aiStore.isLoadingChat" />

      <AiMessageInput :isLoading="isSending || aiStore.isLoadingChat" @send="handleSendMessage" />
    </div>
  </div>
</template>
