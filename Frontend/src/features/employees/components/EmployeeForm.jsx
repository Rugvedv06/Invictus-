import { useState, useEffect } from 'react';
import { Input, Select, Button } from '../../../components/ui';
import { ROLES } from '../../../constants';

const EmployeeForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.EMPLOYEE,
    department: '',
    phone: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const roleOptions = [
    { value: ROLES.ADMIN, label: 'Admin' },
    { value: ROLES.EMPLOYEE, label: 'Employee' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const departmentOptions = [
    { value: 'Management', label: 'Management' },
    { value: 'Production', label: 'Production' },
    { value: 'Quality Control', label: 'Quality Control' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Procurement', label: 'Procurement' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g., john@electrolyte.com"
          required
        />

        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
        />

        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={departmentOptions}
          required
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g., +91-9876543210"
          required
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update' : 'Create'} Employee
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
