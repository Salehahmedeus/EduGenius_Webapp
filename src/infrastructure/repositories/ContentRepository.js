import { IContentRepository } from '@/core/repositories/IContentRepository'
import { contentApi } from '../api/contentApi'

export class ContentRepository extends IContentRepository {
  async getMaterials(params) {
    return await contentApi.getMaterials(params)
  }

  async searchMaterials(query) {
    return await contentApi.searchMaterials(query)
  }

  async uploadMaterial(file, onProgress) {
    return await contentApi.uploadMaterial(file, onProgress)
  }

  async deleteMaterial(id) {
    return await contentApi.deleteMaterial(id)
  }
}
