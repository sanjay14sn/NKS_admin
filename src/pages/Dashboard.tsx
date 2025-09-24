import React from "react";
import {

  LogOut,
  Users,
  Tags,
  Handshake,
  Coins,
} from "lucide-react";
import { AuthService } from "../services/auth";
import { useNavigate } from "react-router-dom";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string; // Tailwind gradient class
  change: string; // e.g. "+2.0%"
}> = ({ title, value, icon, gradient, change }) => {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-all ${gradient}`}
    >
      <div className="flex items-start justify-between">
        <div className="bg-white/20 p-3 rounded-full">{icon}</div>
      </div>
      <h2 className="mt-4 text-lg font-medium">{title}</h2>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <div className="mt-2 text-sm flex items-center justify-between">
        <span className="text-green-200">{change}</span>
        <span className="opacity-80">Last month</span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear auth token and user data
    AuthService.logout();
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      {/* Header with Logout */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to NKS Traders Admin Panel</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={24}
          icon={<Users className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-r from-cyan-500 to-teal-500"
          change="+2.0%"
        />
        <StatCard
          title="Total Products"
          value={12}
          icon={<Tags className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-r from-purple-500 to-indigo-500"
          change="+1.0%"
        />
        <StatCard
          title="Total Shops"
          value={36}
          icon={<Handshake className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-r from-orange-500 to-red-500"
          change="+4.0%"
        />
        <StatCard
          title="Active Users"
          value="142%"
          icon={<Coins className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-r from-pink-500 to-fuchsia-500"
          change="+12%"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">New order received</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">
                Product added to inventory
              </span>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Category updated</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">
                Add New Product
              </span>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">
                View Pending Orders
              </span>
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">
                Manage Categories
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
