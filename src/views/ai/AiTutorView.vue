<script setup>
import { ref, onMounted } from 'vue'
import { aiApi } from '@/infrastructure/api/aiApi'
import { useToast } from '@/composables/useToast'
import AiSidebar from '@/components/ai/AiSidebar.vue'
import AiChatWindow from '@/components/ai/AiChatWindow.vue'
import AiMessageInput from '@/components/ai/AiMessageInput.vue'

const { toast } = useToast()

const chats = ref([])
const currentChatId = ref(null)
const messages = ref([])
const isLoadingList = ref(false)
const isLoadingChat = ref(false)
const isSending = ref(false)

const loadChats = async () => {
  isLoadingList.value = true
  try {
    const data = await aiApi.fetchChats()
    // Depending on API response structure, data might be data.data or data
    chats.value = Array.isArray(data) ? data : data.data || []
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to load conversation history',
      variant: 'destructive',
    })
  } finally {
    isLoadingList.value = false
  }
}

const selectChat = async (id) => {
  if (currentChatId.value === id) return

  currentChatId.value = id
  isLoadingChat.value = true
  messages.value = []

  try {
    const history = await aiApi.fetchHistory(id)
    // Map backend message format to our UI format if needed
    // Assuming history is an array of messages with { role, content, file_name }
    messages.value = Array.isArray(history) ? history : history.data || []
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to load chat history',
      variant: 'destructive',
    })
  } finally {
    isLoadingChat.value = false
  }
}

const startNewChat = () => {
  currentChatId.value = null
  messages.value = []
}

const deleteChat = async (id) => {
  if (!confirm('Are you sure you want to delete this conversation?')) return

  try {
    await aiApi.deleteChat(id)
    chats.value = chats.value.filter((c) => c.id !== id)
    if (currentChatId.value === id) {
      startNewChat()
    }
    toast({
      title: 'Success',
      description: 'Conversation deleted',
    })
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to delete conversation',
      variant: 'destructive',
    })
  }
}

const handleSendMessage = async ({ query, file }) => {
  isSending.value = true

  // Optimistically add user message to UI
  const tempUserMsg = {
    role: 'user',
    content: query,
    file_name: file ? file.name : null,
  }
  messages.value.push(tempUserMsg)

  try {
    const formData = new FormData()
    formData.append('query', query)
    if (currentChatId.value) {
      formData.append('conversation_id', currentChatId.value)
    }
    if (file) {
      formData.append('file', file)
    }

    const response = await aiApi.ask(formData)

    // Update conversation ID if it's a new chat
    if (!currentChatId.value && response.conversation_id) {
      currentChatId.value = response.conversation_id
      await loadChats() // Refresh sidebar to show new chat
    }

    // Add AI response to messages
    if (response.response) {
      messages.value.push({
        role: 'assistant',
        content: response.response,
      })
    }
  } catch (e) {
    // Remove last message on error or show error state
    // messages.value.pop()
    toast({
      title: 'AI Error',
      description: 'Failed to get response from AI Tutor',
      variant: 'destructive',
    })
  } finally {
    isSending.value = false
  }
}

onMounted(() => {
  loadChats()
})
</script>

<template>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
    <!-- Sidebar -->
    <div class="w-64 md:w-72 border-r shrink-0 hidden md:block">
      <AiSidebar
        :chats="chats"
        :currentChatId="currentChatId"
        :isLoading="isLoadingList"
        @select="selectChat"
        @new="startNewChat"
        @delete="deleteChat"
      />
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-muted/5">
      <AiChatWindow :messages="messages" :isLoading="isSending || isLoadingChat" />

      <AiMessageInput :isLoading="isSending || isLoadingChat" @send="handleSendMessage" />
    </div>
  </div>
</template>
