export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  model: 'gemini-2.0-flash-exp',
  defaultTemperature: 0.7,
  defaultMaxTokens: 1024,
  defaultTopP: 0.95,
  defaultTopK: 40,
  streaming: true
}

export const GEMINI_ROLES = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'model'
}

export const TUTORING_SYSTEM_PROMPT = `You are an AI tutor helping students learn various subjects. Your goal is to:

1. Provide clear, accurate explanations
2. Ask follow-up questions to check understanding
3. Adapt your teaching style to the student's needs
4. Be patient and encouraging
5. Break down complex concepts into simpler parts
6. Provide examples when helpful
7. Guide students to answers rather than just giving them

Always maintain a supportive and educational tone.`
