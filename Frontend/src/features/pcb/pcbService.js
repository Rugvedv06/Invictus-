import api from '../../services/api';

const PCB_ENDPOINTS = {
    LIST: '/api/pcbs',
    CREATE: '/api/pcbs',
    UPDATE: (id) => `/api/pcbs/${id}`,
    DELETE: (id) => `/api/pcbs/${id}`,
    GET: (id) => `/api/pcbs/${id}`,
    COMPONENTS: (id) => `/api/pcbs/${id}/components`,
    ADD_COMPONENT: (id) => `/api/pcbs/${id}/components`,
    UPDATE_COMPONENT: (pcbId, componentId) => `/api/pcbs/${pcbId}/components/${componentId}`,
    REMOVE_COMPONENT: (pcbId, componentId) => `/api/pcbs/${pcbId}/components/${componentId}`,
    PRODUCTION: '/api/pcb-production',
    PRODUCTION_DETAIL: (id) => `/api/pcb-production/${id}`,
};

class PCBService {
    // PCB Management
    async getAllPCBs(params = {}) {
        const response = await api.get(PCB_ENDPOINTS.LIST, { params });
        return response.data;
    }

    async getPCBById(id) {
        const response = await api.get(PCB_ENDPOINTS.GET(id));
        return response.data;
    }

    async createPCB(pcbData) {
        const response = await api.post(PCB_ENDPOINTS.CREATE, pcbData);
        return response.data;
    }

    async updatePCB(id, pcbData) {
        const response = await api.put(PCB_ENDPOINTS.UPDATE(id), pcbData);
        return response.data;
    }

    async deletePCB(id) {
        const response = await api.delete(PCB_ENDPOINTS.DELETE(id));
        return response.data;
    }

    // PCB-Component Mapping
    async getPCBComponents(pcbId) {
        const response = await api.get(PCB_ENDPOINTS.COMPONENTS(pcbId));
        return response.data;
    }

    async addComponentToPCB(pcbId, componentData) {
        const response = await api.post(PCB_ENDPOINTS.ADD_COMPONENT(pcbId), componentData);
        return response.data;
    }

    async updatePCBComponent(pcbId, componentId, componentData) {
        const response = await api.put(
            PCB_ENDPOINTS.UPDATE_COMPONENT(pcbId, componentId),
            componentData
        );
        return response.data;
    }

    async removePCBComponent(pcbId, componentId) {
        const response = await api.delete(PCB_ENDPOINTS.REMOVE_COMPONENT(pcbId, componentId));
        return response.data;
    }

    // PCB Production
    async createProduction(productionData) {
        const response = await api.post(PCB_ENDPOINTS.PRODUCTION, productionData);
        return response.data;
    }

    async getAllProductions(params = {}) {
        const response = await api.get(PCB_ENDPOINTS.PRODUCTION, { params });
        return response.data;
    }

    async getProductionById(id) {
        const response = await api.get(PCB_ENDPOINTS.PRODUCTION_DETAIL(id));
        return response.data;
    }
}

export default new PCBService();
