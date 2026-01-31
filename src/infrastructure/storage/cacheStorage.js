class CacheStorage {
  constructor() {
    this.prefix = 'edu_cache_'
    this.defaultTTL = 5 * 60 * 1000
  }
  
  set(key, value, ttl = this.defaultTTL) {
    const item = {
      value,
      expiresAt: Date.now() + ttl
    }
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to cache item:', error)
    }
  }
  
  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key)
      if (!item) return null
      
      const parsed = JSON.parse(item)
      
      if (Date.now() > parsed.expiresAt) {
        this.remove(key)
        return null
      }
      
      return parsed.value
    } catch {
      return null
    }
  }
  
  remove(key) {
    localStorage.removeItem(this.prefix + key)
  }
  
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key))
  }
  
  has(key) {
    const item = this.get(key)
    return item !== null
  }
  
  getOrSet(key, factory, ttl = this.defaultTTL) {
    const cached = this.get(key)
    if (cached !== null) return cached
    
    const value = factory()
    this.set(key, value, ttl)
    return value
  }
}

export const cacheStorage = new CacheStorage()
