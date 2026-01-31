import { defineStore } from 'pinia'
import { ref } from 'vue'
import { aiApi } from '@/infrastructure/api/aiApi'

export const useAiStore = defineStore('ai', () => {
  const chats = ref([])
  const currentChatId = ref(null)
  const messages = ref([])
  const isLoadingList = ref(false)
  const isLoadingChat = ref(false)

  const loadChats = async () => {
    isLoadingList.value = true
    try {
      const data = await aiApi.fetchChats()
      chats.value = Array.isArray(data) ? data : data.data || []
    } catch (e) {
      console.error('Failed to load chats', e)
    } finally {
      isLoadingList.value = false
    }
  }

  const setCurrentChat = async (id) => {
    if (currentChatId.value === id) return
    currentChatId.value = id
    isLoadingChat.value = true
    messages.value = []

    try {
      const history = await aiApi.fetchHistory(id)
      const rawData = Array.isArray(history) ? history : history.data || []

      // Transform interaction records (query/response) into individual messages
      const flattenedMessages = []
      rawData.forEach((item) => {
        // Handle if backend already returns role/content
        if (item.role && item.content) {
          flattenedMessages.push(item)
        }
        // Handle if backend returns interaction pairs (query/response)
        else if (item.query && item.response) {
          flattenedMessages.push({
            role: 'user',
            content: item.query,
            file_name: item.file_name || null,
          })
          flattenedMessages.push({
            role: 'assistant',
            content: item.response,
          })
        }
        // Fallback for partial records
        else if (item.query) {
          flattenedMessages.push({ role: 'user', content: item.query })
        } else if (item.response) {
          flattenedMessages.push({ role: 'assistant', content: item.response })
        }
      })

      messages.value = flattenedMessages
    } catch (e) {
      console.error('Failed to load chat history', e)
    } finally {
      isLoadingChat.value = false
    }
  }

  const deleteChat = async (id) => {
    try {
      await aiApi.deleteChat(id)
      chats.value = chats.value.filter((c) => c.id !== id)
      if (currentChatId.value === id) {
        currentChatId.value = null
        messages.value = []
      }
    } catch (e) {
      console.error('Failed to delete chat', e)
      throw e
    }
  }

  const clearCurrentChat = () => {
    currentChatId.value = null
    messages.value = []
  }

  return {
    chats,
    currentChatId,
    messages,
    isLoadingList,
    isLoadingChat,
    loadChats,
    setCurrentChat,
    deleteChat,
    clearCurrentChat,
  }
})
