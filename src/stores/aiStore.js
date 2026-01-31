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

      // Defensively extract the list of messages/interactions
      let rawData = []
      if (Array.isArray(history)) {
        rawData = history
      } else if (history && history.data && Array.isArray(history.data)) {
        rawData = history.data
      } else if (history && history.history && Array.isArray(history.history)) {
        rawData = history.history
      } else if (history && history.interactions && Array.isArray(history.interactions)) {
        rawData = history.interactions
      }

      // Transform interaction records into individual messages
      const flattenedMessages = []
      rawData.forEach((item) => {
        // 1. Direct role/content format
        if (item.role && (item.content || item.text)) {
          flattenedMessages.push({
            role: item.role,
            content: item.content || item.text,
            file_name: item.file_name || null,
          })
        }
        // 2. Interaction Pair format (query/response, q/a, etc.)
        else {
          const userContent = item.query || item.user_query || item.q || item.request
          const botContent =
            item.response || item.ai_response || item.bot_response || item.answer || item.a

          if (userContent) {
            flattenedMessages.push({
              role: 'user',
              content: userContent,
              file_name: item.file_name || null,
            })
          }

          if (botContent) {
            flattenedMessages.push({
              role: 'assistant',
              content: botContent,
            })
          }
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
