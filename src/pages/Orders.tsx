import React, { useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { orders } from '../data/dummyData';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { OrderTracking } from '../components/OrderTracking';

export const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Today', 'This Week', 'This Month'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {filter}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table headers={['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Actions']}>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {order.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Track
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Tracking - ${selectedOrder?.id}`}
      >
        {selectedOrder && <OrderTracking order={selectedOrder} />}
      </Modal>
    </div>
  );
};
export default Orders;
