import React, { useEffect, useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { AuthService } from '../services/auth';

const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

// Define the Order types based on your backend response
interface OrderItem {
  product: {
    _id: string;
    title: string;
    images?: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Today' | 'This Week' | 'This Month'>('All');
  const [loading, setLoading] = useState(false);

  const filters: typeof activeFilter[] = ['All', 'Today', 'This Week', 'This Month'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = AuthService.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/orders`, { headers });
      const data = await response.json();
      if (response.ok && data.orders) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    switch (activeFilter) {
      case 'Today':
        return orderDate.toDateString() === now.toDateString();
      case 'This Week': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      }
      case 'This Month':
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const headers = { ...AuthService.getAuthHeaders(), 'Content-Type': 'application/json' };
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchOrders(); // Refresh orders after update
      } else {
        console.error('Failed to update status', data.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
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

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <Table headers={['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Actions']}>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order._id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.user.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">₹{order.total}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Track
                    </Button>

                    {/* Example: Quick status update buttons */}
                    {order.status !== 'shipped' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order._id, 'shipped')}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Mark Shipped
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Tracking - ${selectedOrder?._id}`}
      >
        {selectedOrder ? (
          <div className="space-y-2">
            <div>
              <strong>Customer:</strong> {selectedOrder.user.name} ({selectedOrder.user.phone})
            </div>
            <div>
              <strong>Address:</strong> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipCode}
            </div>
            <div>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
            </div>
            <div>
              <strong>Notes:</strong> {selectedOrder.notes || 'None'}
            </div>
            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item) => (
                  <li key={item.product._id}>
                    {item.product.title} x {item.quantity} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 font-semibold">Total: ₹{selectedOrder.total}</div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Orders;
