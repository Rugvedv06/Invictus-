import api from '../../services/api';

const ANALYTICS_ENDPOINTS = {
    CONSUMPTION_SUMMARY: '/api/analytics/consumption-summary',
    TOP_CONSUMED: '/api/analytics/top-consumed',
    LOW_STOCK: '/api/analytics/low-stock',
    PCB_PRODUCTION_SUMMARY: '/api/analytics/pcb-production-summary',
    CONSUMPTION_TRENDS: '/api/analytics/consumption-trends',
    STOCK_ALERTS: '/api/analytics/stock-alerts',
    PROCUREMENT_STATUS: '/api/analytics/procurement-status',
};

class AnalyticsService {
    async getConsumptionSummary(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.CONSUMPTION_SUMMARY, { params });
        return response.data;
    }

    async getTopConsumedComponents(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.TOP_CONSUMED, { params });
        return response.data;
    }

    async getLowStockComponents(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.LOW_STOCK, { params });
        return response.data;
    }

    async getPCBProductionSummary(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.PCB_PRODUCTION_SUMMARY, { params });
        return response.data;
    }

    async getConsumptionTrends(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.CONSUMPTION_TRENDS, { params });
        return response.data;
    }

    async getStockAlerts() {
        const response = await api.get(ANALYTICS_ENDPOINTS.STOCK_ALERTS);
        return response.data;
    }

    async getProcurementStatus() {
        const response = await api.get(ANALYTICS_ENDPOINTS.PROCUREMENT_STATUS);
        return response.data;
    }
}

export default new AnalyticsService();
