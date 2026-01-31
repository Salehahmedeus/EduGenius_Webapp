import { APP_CONSTANTS } from '@/shared/constants/appConstants'
import { GEMINI_CONFIG } from '@/shared/constants/geminiConfig'

class GeminiKeyStorage {
  constructor() {
    this.storageKey = APP_CONSTANTS.STORAGE_KEYS.GEMINI_KEY
  }
  
  setKey(apiKey) {
    localStorage.setItem(this.storageKey, apiKey)
  }
  
  getKey() {
    return localStorage.getItem(this.storageKey) || GEMINI_CONFIG.apiKey
  }
  
  removeKey() {
    localStorage.removeItem(this.storageKey)
  }
  
  hasKey() {
    const key = this.getKey()
    return key && key.trim() !== ''
  }
  
  clear() {
    this.removeKey()
  }
}

export const geminiKeyStorage = new GeminiKeyStorage()
