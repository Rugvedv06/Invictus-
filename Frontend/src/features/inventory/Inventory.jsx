import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  getAllInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateStock,
  reset,
  clearError
} from './inventorySlice';
import { RotateCw, Plus } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import InventoryTable from './components/InventoryTable';
import InventoryForm from './components/InventoryForm';
import { useDebounce } from '../../hooks';
import { filterData } from '../../helpers';

const Inventory = () => {
  const dispatch = useDispatch();
  const { items, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockEditingItem, setStockEditingItem] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getAllInventory());
    setIsRefreshing(false);
  };

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
      'unit',
      'supplier',
      'createdAt',
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

  const handleStockEdit = (item) => {
    setStockEditingItem(item);
    setNewStock(item.stock.toString());
    setIsStockModalOpen(true);
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    await dispatch(updateStock({ id: stockEditingItem.id, quantity: parseInt(newStock) }));
    setIsStockModalOpen(false);
    setStockEditingItem(null);
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
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={handleRefresh}
            variant="secondary"
            className="flex items-center gap-2"
            disabled={isRefreshing}
            aria-label="Refresh Data"
          >
            {isRefreshing ? (
              <span className="animate-spin"><RotateCw size={18} /></span>
            ) : (
              <RotateCw size={18} />
            )}
            Refresh Data
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStockEdit={handleStockEdit}
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

      <Modal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        title="Update Stock Quantity"
        size="sm"
      >
        <form onSubmit={handleStockUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity ({stockEditingItem?.unit})
            </label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsStockModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Stock
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
