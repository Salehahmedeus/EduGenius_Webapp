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
      messages.value = Array.isArray(history) ? history : history.data || []
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
