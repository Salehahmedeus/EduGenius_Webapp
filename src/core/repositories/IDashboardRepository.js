export class IDashboardRepository {
  async getStats(userId) {
    throw new Error('Method not implemented')
  }
  
  async getProgress(userId, startDate, endDate) {
    throw new Error('Method not implemented')
  }
  
  async getActivity(userId, limit) {
    throw new Error('Method not implemented')
  }
  
  async generateReport(userId, startDate, endDate) {
    throw new Error('Method not implemented')
  }
}
