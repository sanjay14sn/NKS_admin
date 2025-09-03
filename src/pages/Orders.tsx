import React, { useState, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { OrderTracking } from '../components/OrderTracking';
import { AuthService } from '../services/auth';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

interface Order {
  _id: string;
  user: { name: string; phone: string };
  items: any[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Today', 'This Week', 'This Month'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const headers = AuthService.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/orders`, { headers });
      const data = await response.json();
      if (response.ok) setOrders(data.orders || []);
      else toast.error(data.error || 'Failed to fetch orders');
    } catch (err) {
      console.error(err);
      toast.error('Network error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const headers = AuthService.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;

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
            size="sm"
            variant={activeFilter === filter ? 'primary' : 'secondary'}
            onClick={() => setActiveFilter(filter)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {filter}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table headers={['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Actions']}>
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Track
                </button>
                <Button size="sm" onClick={() => updateOrderStatus(order._id, 'shipped')}>
                  Mark Shipped
                </Button>
                <Button size="sm" onClick={() => updateOrderStatus(order._id, 'delivered')}>
                  Mark Delivered
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Tracking - ${selectedOrder?._id}`}
      >
        {selectedOrder && (
          <OrderTracking
            order={{
              id: selectedOrder._id,
              customer: selectedOrder.user.name,
              status: selectedOrder.status,
              total: selectedOrder.total,
              date: new Date(selectedOrder.createdAt).toLocaleDateString(),
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders;
