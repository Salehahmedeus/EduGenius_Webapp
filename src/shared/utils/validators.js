export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  password: (value) => {
    return value && value.length >= 8
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value !== ''
  },
  
  minLength: (value, min) => {
    return value && value.length >= min
  },
  
  maxLength: (value, max) => {
    return !value || value.length <= max
  },
  
  url: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  
  number: (value) => {
    return !isNaN(value) && isFinite(value)
  },
  
  positive: (value) => {
    return validators.number(value) && value > 0
  },
  
  percentage: (value) => {
    return validators.number(value) && value >= 0 && value <= 100
  }
}

export const validateForm = (rules, data) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = data[field]
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'function') {
        const result = rule(value)
        if (result !== true) {
          errors[field] = result || 'Invalid value'
        }
      } else if (typeof rule === 'object') {
        const isValid = rule.validator(value)
        if (!isValid) {
          errors[field] = rule.message || 'Invalid value'
        }
      }
    })
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
