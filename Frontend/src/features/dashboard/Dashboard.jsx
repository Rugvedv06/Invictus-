import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { getDashboardStats } from './dashboardSlice';
import { StatCard } from '../../components/shared';
import { LoadingSpinner } from '../../components/ui';
import { useRole } from '../../hooks';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useRole();
  const { stats, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-1">Welcome back! Here's an overview of your inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon={Package}
          color="blue"
        />

        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          color="yellow"
        />

        <StatCard
          title="In Stock"
          value={stats.totalItems - stats.lowStockItems - stats.outOfStock}
          icon={CheckCircle}
          color="green"
        />

        {isAdmin && (
          <StatCard
            title="Active Employees"
            value={stats.totalEmployees}
            icon={Users}
            color="blue"
          />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-secondary-200">
              <span className="text-secondary-600">Total Inventory Items</span>
              <span className="font-semibold text-secondary-900">{stats.totalItems}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-secondary-200">
              <span className="text-secondary-600">Items In Stock</span>
              <span className="font-semibold text-success">
                {stats.totalItems - stats.lowStockItems - stats.outOfStock}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-secondary-200">
              <span className="text-secondary-600">Low Stock Items</span>
              <span className="font-semibold text-warning">{stats.lowStockItems}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary-600">Out of Stock</span>
              <span className="font-semibold text-danger">{stats.outOfStock}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-600">In Stock</span>
                <span className="font-medium">
                  {Math.round(((stats.totalItems - stats.lowStockItems - stats.outOfStock) / stats.totalItems) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{
                    width: `${((stats.totalItems - stats.lowStockItems - stats.outOfStock) / stats.totalItems) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-600">Low Stock</span>
                <span className="font-medium">
                  {Math.round((stats.lowStockItems / stats.totalItems) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full"
                  style={{
                    width: `${(stats.lowStockItems / stats.totalItems) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-600">Out of Stock</span>
                <span className="font-medium">
                  {Math.round((stats.outOfStock / stats.totalItems) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-danger h-2 rounded-full"
                  style={{
                    width: `${(stats.outOfStock / stats.totalItems) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
