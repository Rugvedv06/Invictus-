import { useState, useEffect } from 'react';
import { Input, Select, Button } from '../../../components/ui';

const InventoryForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    stock: 0,
    monthlyRequired: 0,
    unit: 'pieces',
    category: '',
    supplier: '',
    location: '',
    reorderLevel: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categoryOptions = [
    { value: 'Capacitors', label: 'Capacitors' },
    { value: 'Resistors', label: 'Resistors' },
    { value: 'Microcontrollers', label: 'Microcontrollers' },
    { value: 'LEDs', label: 'LEDs' },
    { value: 'PCBs', label: 'PCBs' },
    { value: 'Oscillators', label: 'Oscillators' },
    { value: 'Other', label: 'Other' },
  ];

  const unitOptions = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'meters', label: 'Meters' },
    { value: 'liters', label: 'Liters' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Component Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., 10µF Capacitor"
          required
        />

        <Input
          label="Part Number"
          name="partNumber"
          value={formData.partNumber}
          onChange={handleChange}
          placeholder="e.g., CAP-10UF-001"
          required
        />

        <Input
          label="Current Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          required
        />

        <Input
          label="Monthly Required"
          name="monthlyRequired"
          type="number"
          value={formData.monthlyRequired}
          onChange={handleChange}
          placeholder="0"
          required
        />

        <Select
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          options={unitOptions}
          required
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
        />

        <Input
          label="Supplier"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          placeholder="e.g., ABC Electronics"
          required
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Shelf A-1"
          required
        />

        <Input
          label="Reorder Level"
          name="reorderLevel"
          type="number"
          value={formData.reorderLevel}
          onChange={handleChange}
          placeholder="0"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update' : 'Create'} Item
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;
