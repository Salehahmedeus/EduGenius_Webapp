export const dateHelpers = {
  now: () => new Date(),
  
  today: () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  },
  
  yesterday: () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    return yesterday
  },
  
  addDays: (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },
  
  subtractDays: (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() - days)
    return result
  },
  
  addHours: (date, hours) => {
    const result = new Date(date)
    result.setHours(result.getHours() + hours)
    return result
  },
  
  subtractHours: (date, hours) => {
    const result = new Date(date)
    result.setHours(result.getHours() - hours)
    return result
  },
  
  isToday: (date) => {
    const today = new Date()
    const d = new Date(date)
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
  },
  
  isYesterday: (date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const d = new Date(date)
    return d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
  },
  
  isSameDay: (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
  },
  
  diffInDays: (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = d2 - d1
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },
  
  diffInHours: (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = d2 - d1
    return Math.ceil(diffTime / (1000 * 60 * 60))
  },
  
  isFuture: (date) => {
    return new Date(date) > new Date()
  },
  
  isPast: (date) => {
    return new Date(date) < new Date()
  },
  
  isValid: (date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  },
  
  startOfDay: (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  },
  
  endOfDay: (date) => {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
  },
  
  startOfWeek: (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
  },
  
  endOfWeek: (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? 0 : 7)
    d.setDate(diff)
    d.setHours(23, 59, 59, 999)
    return d
  }
}
