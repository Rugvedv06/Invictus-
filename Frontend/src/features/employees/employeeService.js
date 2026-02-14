import { simulateApiDelay } from '../../services/api';
import { mockEmployees } from '../../mockData';

let employeesData = [...mockEmployees];

class EmployeeService {
  async getAllEmployees() {
    await simulateApiDelay(null);
    return employeesData;
  }
  
  async getEmployee(id) {
    await simulateApiDelay(null);
    const employee = employeesData.find((emp) => emp.id === id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  }
  
  async createEmployee(employeeData) {
    await simulateApiDelay(null);
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString(),
      joinedDate: new Date().toISOString().split('T')[0],
      assignedInventory: [],
    };
    employeesData.push(newEmployee);
    return newEmployee;
  }
  
  async updateEmployee(id, employeeData) {
    await simulateApiDelay(null);
    const index = employeesData.findIndex((emp) => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    employeesData[index] = {
      ...employeesData[index],
      ...employeeData,
    };
    return employeesData[index];
  }
  
  async deleteEmployee(id) {
    await simulateApiDelay(null);
    const index = employeesData.findIndex((emp) => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    employeesData.splice(index, 1);
    return { id };
  }
  
  async getActiveEmployees() {
    await simulateApiDelay(null);
    return employeesData.filter((emp) => emp.status === 'active');
  }
}

export default new EmployeeService();
