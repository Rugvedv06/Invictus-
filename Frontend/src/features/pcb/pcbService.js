import api from '../../services/api';

const PCB_ENDPOINTS = {
    LIST: '/pcbs',
    CREATE: '/pcbs',
    UPDATE: (id) => `/pcbs/${id}`,
    DELETE: (id) => `/pcbs/${id}`,
    GET: (id) => `/pcbs/${id}`,
    COMPONENTS: (id) => `/pcbs/${id}/components`,
    ADD_COMPONENT: (id) => `/pcbs/${id}/components`,
    REMOVE_COMPONENT: (pcbId, componentId) => `/pcbs/${pcbId}/components/${componentId}`,
    PRODUCTION: '/production',
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
        const response = await api.patch(PCB_ENDPOINTS.UPDATE(id), pcbData);
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

    async getProductionConsumption(productionId) {
        const response = await api.get(`${PCB_ENDPOINTS.PRODUCTION}/consumption`, {
            params: { productionId }
        });
        return response.data;
    }
}

export default new PCBService();
