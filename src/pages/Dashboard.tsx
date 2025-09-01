import React from 'react';
import { ShoppingCart, Package, FolderOpen, TrendingUp, Calendar } from 'lucide-react';
import { dashboardStats } from '../data/dummyData';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to NKS Traders Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Orders This Week"
          value={dashboardStats.ordersThisWeek}
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Orders This Month"
          value={dashboardStats.ordersThisMonth}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Products"
          value={dashboardStats.totalProducts}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Total Categories"
          value={dashboardStats.totalCategories}
          icon={<FolderOpen className="h-6 w-6 text-white" />}
          color="bg-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">New order received</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Product added to inventory</span>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Category updated</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Add New Product</span>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">View Pending Orders</span>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Manage Categories</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

