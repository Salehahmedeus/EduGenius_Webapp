import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtStorage } from '@/infrastructure/storage/jwtStorage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(jwtStorage.getUserData())
  const accessToken = ref(jwtStorage.getAccessToken())

  const isLoggedIn = computed(() => !!accessToken.value)

  function setTokens(access, refresh) {
    accessToken.value = access
    jwtStorage.setAccessToken(access)
    if (refresh) {
      jwtStorage.setRefreshToken(refresh)
    }
  }

  function setUser(userData) {
    user.value = userData
    jwtStorage.setUserData(userData)
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    jwtStorage.clearTokens()
  }

  function initializeAuth() {
    user.value = jwtStorage.getUserData()
    accessToken.value = jwtStorage.getAccessToken()
  }

  return {
    user,
    accessToken,
    isLoggedIn,
    setTokens,
    setUser,
    clearAuth,
    initializeAuth,
  }
})
