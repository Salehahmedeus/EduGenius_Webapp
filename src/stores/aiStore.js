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
    if (!id) return
    if (currentChatId.value === id && messages.value.length > 0) return

    currentChatId.value = id
    isLoadingChat.value = true

    // Don't clear messages immediately to avoid flicker if load is fast
    // messages.value = []

    try {
      const response = await aiApi.fetchHistory(id)

      // EXHAUSTIVE DEFENSIVE EXTRACTION
      // The goal is to find an array of items anywhere in the response
      let rawItems = []
      if (Array.isArray(response)) {
        rawItems = response
      } else if (response && typeof response === 'object') {
        const potentialKeys = [
          'data',
          'messages',
          'interactions',
          'history',
          'items',
          'chat_history',
        ]
        for (const key of potentialKeys) {
          if (Array.isArray(response[key])) {
            rawItems = response[key]
            break
          }
        }
        // Fallback: search all object keys for first array found
        if (rawItems.length === 0) {
          const firstArrayKey = Object.keys(response).find((k) => Array.isArray(response[k]))
          if (firstArrayKey) rawItems = response[firstArrayKey]
        }
      }

      const normalizedMessages = []
      rawItems.forEach((item) => {
        // 1. Check for standard role/content or variations
        const role = (item.role || item.sender || item.type || '').toLowerCase()
        const content = item.content || item.text || item.message || item.body

        if (role && content) {
          normalizedMessages.push({
            role: role.includes('user') ? 'user' : 'assistant',
            content: content,
            file_name: item.file_name || null,
          })
        }
        // 2. Check for interaction pairs (query & response in same object)
        else {
          const userContent = item.query || item.user_query || item.q || item.request || item.prompt
          const assistantContent =
            item.response ||
            item.ai_response ||
            item.bot_response ||
            item.answer ||
            item.a ||
            item.res

          if (userContent) {
            normalizedMessages.push({
              role: 'user',
              content: userContent,
              file_name: item.file_name || item.fileName || null,
            })
          }

          if (assistantContent) {
            normalizedMessages.push({
              role: 'assistant',
              content: assistantContent,
            })
          }
        }
      })

      messages.value = normalizedMessages
    } catch (e) {
      console.error('Failed to load chat history', e)
      // Keep existing messages or notify user
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
