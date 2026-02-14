import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui';
import { calculateStockStatus, getStockStatusColor, getStockStatusLabel, formatDate } from '../../../helpers';

const InventoryTable = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No inventory items found. Add your first item to get started.
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <div className="bg-white shadow-sm rounded-md overflow-hidden">
          <table className="w-full min-w-[900px]">
            <thead className="bg-white border-b">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Req.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((item) => {
              const status = calculateStockStatus(item.stock, item.monthlyRequired);
              const statusColor = getStockStatusColor(status);
              const statusLabel = getStockStatusLabel(status);

              return (
                <tr key={item.id} className="hover:shadow-sm transition-shadow even:bg-gray-50">
                  <td className="px-8 py-5 align-top whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.partNumber}</div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.stock} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {item.monthlyRequired} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.unit}</div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(item.createdAt)}</div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(item.lastUpdated)}</div>
                  </td>
                  <td className="px-6 py-5 align-top whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-md border border-transparent hover:bg-gray-50"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 rounded-md border border-transparent text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
