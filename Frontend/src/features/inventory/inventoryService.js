import api from '../../services/api';

const toUiItem = (item) => ({
  id: item.id,
  name: item.component_name,
  partNumber: item.part_number,
  stock: item.current_stock_quantity,
  monthlyRequired: item.monthly_required_quantity,
  unit: item.unit_of_measurement || 'pcs',
  category: '',
  supplier: '',
  location: '',
  reorderLevel: item.reorder_threshold ?? 0,
  createdAt: item.created_at,
  lastUpdated: item.updated_at || item.created_at,
});

const toApiPayload = (itemData) => ({
  component_name: itemData.name,
  part_number: itemData.partNumber,
  description: itemData.description || null,
  current_stock_quantity: Number(itemData.stock ?? 0),
  monthly_required_quantity: Number(itemData.monthlyRequired ?? 0),
  unit_of_measurement: itemData.unit || 'pcs',
  reorder_threshold: Number(itemData.reorderLevel ?? 0),
});

class InventoryService {
  async getAllInventory() {
    const response = await api.get('/components');
    return response.data.map(toUiItem);
  }
  
  async getInventoryItem(id) {
    const response = await api.get(`/components/${id}`);
    return toUiItem(response.data);
  }
  
  async createInventoryItem(itemData) {
    const response = await api.post('/components', toApiPayload(itemData));
    return toUiItem(response.data);
  }
  
  async updateInventoryItem(id, itemData) {
    const response = await api.patch(`/components/${id}`, toApiPayload(itemData));
    return toUiItem(response.data);
  }
  
  async deleteInventoryItem(id) {
    await api.delete(`/components/${id}`);
    return { id };
  }
  
  async updateStock(id, quantity) {
    const response = await api.post(`/components/${id}/adjust-stock`, {
      adjustment_type: 'correction',
      quantity: Number(quantity),
      reason: 'Updated from inventory UI',
    });
    return toUiItem(response.data.component);
  }
  
  async getLowStockItems() {
    const response = await api.get('/components', {
      params: { lowStock: true },
    });
    return response.data.map(toUiItem);
  }
}

export default new InventoryService();
