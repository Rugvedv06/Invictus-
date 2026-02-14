import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button, Modal, Alert, SearchBar, LoadingSpinner } from '../../components/ui';
import InventoryForm from './components/InventoryForm';
import InventoryTable from './components/InventoryTable';
import {
  getAllInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  reset,
  clearError,
} from './inventorySlice';
import { useDebounce } from '../../hooks';
import { filterData } from '../../helpers';

const Inventory = () => {
  const dispatch = useDispatch();
  const { items, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getAllInventory());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (isSuccess) {
      setShowAlert(true);
      setAlertType('success');
      setTimeout(() => {
        setShowAlert(false);
        dispatch(reset());
      }, 3000);
    }
    if (isError) {
      setShowAlert(true);
      setAlertType('error');
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearError());
      }, 3000);
    }
  }, [isSuccess, isError, dispatch]);

  const filteredItems = useMemo(() => {
    return filterData(items, debouncedSearch, [
      'name',
      'partNumber',
      'category',
      'supplier',
      'location',
    ]);
  }, [items, debouncedSearch]);

  const handleCreate = async (formData) => {
    await dispatch(createInventoryItem(formData));
    setIsModalOpen(false);
  };

  const handleUpdate = async (formData) => {
    await dispatch(updateInventoryItem({ id: editingItem.id, itemData: formData }));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await dispatch(deleteInventoryItem(id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Manage your component inventory</p>
      </div>

      {showAlert && (
        <Alert
          type={alertType}
          message={message || (alertType === 'success' ? 'Operation completed successfully' : 'An error occurred')}
          onClose={() => setShowAlert(false)}
          className="mb-4"
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inventory..."
          className="w-full md:w-96"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          Add Item
        </Button>
      </div>

      <InventoryTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        size="lg"
      >
        <InventoryForm
          initialData={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Inventory;
