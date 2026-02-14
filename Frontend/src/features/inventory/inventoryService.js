import { simulateApiDelay } from '../../services/api';
import { mockInventory } from '../../mockData';

let inventoryData = [...mockInventory];

class InventoryService {
  async getAllInventory() {
    await simulateApiDelay(null);
    return inventoryData;
  }
  
  async getInventoryItem(id) {
    await simulateApiDelay(null);
    const item = inventoryData.find((item) => item.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }
  
  async createInventoryItem(itemData) {
    await simulateApiDelay(null);
    const newItem = {
      ...itemData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    inventoryData.push(newItem);
    return newItem;
  }
  
  async updateInventoryItem(id, itemData) {
    await simulateApiDelay(null);
    const index = inventoryData.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    inventoryData[index] = {
      ...inventoryData[index],
      ...itemData,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    return inventoryData[index];
  }
  
  async deleteInventoryItem(id) {
    await simulateApiDelay(null);
    const index = inventoryData.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    inventoryData.splice(index, 1);
    return { id };
  }
  
  async updateStock(id, quantity) {
    await simulateApiDelay(null);
    const index = inventoryData.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    inventoryData[index].stock = quantity;
    inventoryData[index].lastUpdated = new Date().toISOString().split('T')[0];
    return inventoryData[index];
  }
  
  async getLowStockItems() {
    await simulateApiDelay(null);
    return inventoryData.filter(
      (item) => item.stock < item.monthlyRequired * 0.2
    );
  }
}

export default new InventoryService();
