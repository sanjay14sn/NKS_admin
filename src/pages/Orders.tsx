import React, { useEffect, useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { AuthService } from '../services/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

// --- Types ---
interface OrderItem {
  product: { _id: string; title: string; images?: string[] } | null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: { _id: string; name: string; phone: string } | null;
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  } | null;
  items: OrderItem[] | null;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Main Component ---
export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Today' | 'This Week' | 'This Month'>('All');
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const filters: typeof activeFilter[] = ['All', 'Today', 'This Week', 'This Month'];
  const statusOptions = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = AuthService.getAuthHeaders();
      if (!headers.Authorization) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/orders`, { headers });
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to fetch orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const headers = { ...AuthService.getAuthHeaders(), 'Content-Type': 'application/json' };
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order status updated!');
        fetchOrders(); // Refresh orders
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while updating status');
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    switch (activeFilter) {
      case 'Today':
        return orderDate.toDateString() === now.toDateString();
      case 'This Week': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
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

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              setActiveFilter(filter);
              setCurrentPage(1); // reset to page 1 on filter change
            }}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" /> {filter}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : paginatedOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <Table headers={['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Actions']}>
            {paginatedOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order._id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.user?.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">₹{order.total || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <Button size="sm" onClick={() => setSelectedOrder(order)} className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" /> Track
                  </Button>
                </td>
              </tr>
            ))}
          </Table>

          {/* ✅ Pagination below the table */}
          <div className="flex justify-between items-center p-4 border-t">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Tracking - ${selectedOrder?._id || ''}`}
      >
        {selectedOrder && (
          <div className="space-y-2">
            <div><strong>Customer:</strong> {selectedOrder.user?.name || 'N/A'} ({selectedOrder.user?.phone || 'N/A'})</div>
            <div><strong>Address:</strong> {selectedOrder.shippingAddress?.street || ''}, {selectedOrder.shippingAddress?.city || ''}, {selectedOrder.shippingAddress?.state || ''}, {selectedOrder.shippingAddress?.zipCode || ''}</div>
            <div><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'} ({selectedOrder.paymentStatus || 'N/A'})</div>
            <div><strong>Notes:</strong> {selectedOrder.notes || 'None'}</div>

            <div className="mt-2">
              <strong>Status:</strong>
              <select
                value={selectedOrder.status || ''}
                onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                className="ml-2 border rounded p-1"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {selectedOrder.items?.map((item) => (
                  <li key={item.product?._id || Math.random()}>
                    {item.product?.title || 'Unknown'} x {item.quantity || 0} - ₹{item.price || 0}
                  </li>
                )) || <li>No items</li>}
              </ul>
            </div>

            <div className="mt-2 font-semibold">Total: ₹{selectedOrder.total || 0}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
