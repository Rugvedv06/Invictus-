import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button, Modal, Alert, SearchBar, LoadingSpinner } from '../../components/ui';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  reset,
  clearError,
} from './employeeSlice';
import { useDebounce } from '../../hooks';
import { filterData } from '../../helpers';

const Employees = () => {
  const dispatch = useDispatch();
  const { employees, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.employees
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(getAllEmployees());
    }
  }, [dispatch, employees.length]);

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

  const filteredEmployees = useMemo(() => {
    return filterData(employees, debouncedSearch, [
      'name',
      'email',
      'role',
      'department',
      'phone',
    ]);
  }, [employees, debouncedSearch]);

  const handleCreate = async (formData) => {
    await dispatch(createEmployee(formData));
    setIsModalOpen(false);
  };

  const handleUpdate = async (formData) => {
    await dispatch(updateEmployee({ id: editingEmployee.id, employeeData: formData }));
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await dispatch(deleteEmployee(id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <p className="text-gray-600 mt-1">Manage your team members</p>
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
          placeholder="Search employees..."
          className="w-full md:w-96"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          Add Employee
        </Button>
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={editingEmployee ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Employees;
