export const helpers = {
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
  
  throttle: (func, limit) => {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
  
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => helpers.deepClone(item))
    if (obj instanceof Object) {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = helpers.deepClone(obj[key])
        }
      }
      return clonedObj
    }
  },
  
  generateId: () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  
  retry: async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === maxRetries - 1) throw error
        await helpers.sleep(delay * (i + 1))
      }
    }
  },
  
  isEmpty: (value) => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
  },
  
  pick: (obj, keys) => {
    return keys.reduce((result, key) => {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key]
      }
      return result
    }, {})
  },
  
  omit: (obj, keys) => {
    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
  },
  
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key]
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    }, {})
  },
  
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
  },
  
  chunk: (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },
  
  unique: (array, key) => {
    if (!key) return [...new Set(array)]
    const seen = new Set()
    return array.filter(item => {
      const keyValue = item[key]
      if (seen.has(keyValue)) return false
      seen.add(keyValue)
      return true
    })
  },
  
  sanitizeHTML: (html) => {
    const div = document.createElement('div')
    div.textContent = html
    return div.innerHTML
  },
  
  parseJSON: (json, fallback = null) => {
    try {
      return JSON.parse(json)
    } catch {
      return fallback
    }
  }
}
