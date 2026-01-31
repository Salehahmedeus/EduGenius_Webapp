export class IContentRepository {
  async getMaterials(params) {
    throw new Error('Method not implemented')
  }

  async searchMaterials(query) {
    throw new Error('Method not implemented')
  }

  async uploadMaterial(file, onProgress) {
    throw new Error('Method not implemented')
  }

  async deleteMaterial(id) {
    throw new Error('Method not implemented')
  }
}
