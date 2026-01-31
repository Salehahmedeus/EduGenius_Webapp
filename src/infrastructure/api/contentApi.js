import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints'

export const contentApi = {
  async getMaterials(params = {}) {
    // Postman: GET /api/materials
    const response = await apiClient.get(API_ENDPOINTS.materials.list, { params })
    return response.data
  },

  async searchMaterials(query) {
    // Postman: GET /api/materials/search
    // Assuming query param 'q' or similar, though Postman showed body.
    // We'll use params for GET request best practice.
    const response = await apiClient.get(API_ENDPOINTS.materials.search, { params: { query } })
    return response.data
  },

  async uploadMaterial(file, onProgress) {
    // Postman: POST /api/materials/upload
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post(API_ENDPOINTS.materials.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })

    return response.data
  },

  async deleteMaterial(id) {
    // Postman: DELETE /api/materials/:id
    const response = await apiClient.delete(API_ENDPOINTS.materials.delete.replace(':id', id))
    return response.data
  },
}
