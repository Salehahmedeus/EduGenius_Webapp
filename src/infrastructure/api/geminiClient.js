import { GEMINI_CONFIG, GEMINI_ROLES } from '@/shared/constants/geminiConfig'
import { geminiKeyStorage } from '../storage/geminiKeyStorage'

class GeminiClient {
  constructor() {
    this.apiKey = geminiKeyStorage.getKey()
  }
  
  updateApiKey() {
    this.apiKey = geminiKeyStorage.getKey()
  }
  
  async generateContent(prompt, options = {}) {
    this.updateApiKey()
    
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured')
    }
    
    const response = await fetch(
      `${GEMINI_CONFIG.baseURL}/models/${GEMINI_CONFIG.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: this.formatMessages(prompt, options.messages || []),
          generationConfig: {
            temperature: options.temperature ?? GEMINI_CONFIG.defaultTemperature,
            maxOutputTokens: options.maxTokens ?? GEMINI_CONFIG.defaultMaxTokens,
            topP: options.topP ?? GEMINI_CONFIG.defaultTopP,
            topK: options.topK ?? GEMINI_CONFIG.defaultTopK
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    return this.parseResponse(data)
  }
  
  async generateContentStream(prompt, options = {}) {
    this.updateApiKey()
    
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured')
    }
    
    const response = await fetch(
      `${GEMINI_CONFIG.baseURL}/models/${GEMINI_CONFIG.model}:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: this.formatMessages(prompt, options.messages || []),
          generationConfig: {
            temperature: options.temperature ?? GEMINI_CONFIG.defaultTemperature,
            maxOutputTokens: options.maxTokens ?? GEMINI_CONFIG.defaultMaxTokens
          }
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`)
    }
    
    return this.parseStreamResponse(response)
  }
  
  formatMessages(systemPrompt, messages) {
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      }
    ]
    
    messages.forEach(msg => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })
    })
    
    return contents
  }
  
  parseResponse(data) {
    const candidate = data.candidates?.[0]
    const text = candidate?.content?.parts?.[0]?.text || ''
    const finishReason = candidate?.finishReason || 'STOP'
    
    return {
      text,
      finishReason,
      safetyRatings: candidate?.safetyRatings || []
    }
  }
  
  async *parseStreamResponse(response) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          const candidate = data.candidates?.[0]
          const text = candidate?.content?.parts?.[0]?.text || ''
          
          if (text) {
            yield text
          }
        } catch {
        }
      }
    }
  }
}

export const geminiClient = new GeminiClient()
