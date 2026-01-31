import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const contentApi = {
  async getCourses(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.content.courses, { params })
    return response.data
  },
  
  async getCourse(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.content.courses}/${id}`)
    return response.data
  },
  
  async createCourse(data) {
    const response = await apiClient.post(API_ENDPOINTS.content.courses, data)
    return response.data
  },
  
  async updateCourse(id, data) {
    const response = await apiClient.put(`${API_ENDPOINTS.content.courses}/${id}`, data)
    return response.data
  },
  
  async deleteCourse(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.content.courses}/${id}`)
    return response.data
  },
  
  async getLessons(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.content.lessons, { params })
    return response.data
  },
  
  async getLesson(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.content.lessons}/${id}`)
    return response.data
  },
  
  async createLesson(data) {
    const response = await apiClient.post(API_ENDPOINTS.content.lessons, data)
    return response.data
  },
  
  async updateLesson(id, data) {
    const response = await apiClient.put(`${API_ENDPOINTS.content.lessons}/${id}`, data)
    return response.data
  },
  
  async deleteLesson(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.content.lessons}/${id}`)
    return response.data
  },
  
  async getModules(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.content.modules, { params })
    return response.data
  },
  
  async getModule(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.content.modules}/${id}`)
    return response.data
  },
  
  async createModule(data) {
    const response = await apiClient.post(API_ENDPOINTS.content.modules, data)
    return response.data
  },
  
  async updateModule(id, data) {
    const response = await apiClient.put(`${API_ENDPOINTS.content.modules}/${id}`, data)
    return response.data
  },
  
  async deleteModule(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.content.modules}/${id}`)
    return response.data
  },
  
  async getContentTree(courseId) {
    const response = await apiClient.get(`${API_ENDPOINTS.content.tree}/${courseId}`)
    return response.data
  },
  
  async uploadMedia(file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post(API_ENDPOINTS.content.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      }
    })
    
    return response.data
  }
}
