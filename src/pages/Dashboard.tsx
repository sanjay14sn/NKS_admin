import React, { useEffect, useState } from "react";
import {
  LogOut,
  Users,
  Tags,
  Handshake,
  Coins,
} from "lucide-react";
import { AuthService } from "../services/auth";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  users: {
    total: number;
    shopOwners: number;
    electricians: number;
    admins: number;
  };
  categories: {
    total: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    pending: number;
    completed: number;
  };
  period: {
    month: string;
    year: number;
  };
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}> = ({ title, value, icon, gradient }) => {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-all ${gradient}`}
    >
      <div className="flex items-start justify-between">
        <div className="bg-white/20 p-3 rounded-full">{icon}</div>
      </div>
      <h2 className="mt-4 text-lg font-medium">{title}</h2>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://nks-backend-mou5.onrender.com/api/stats/dashboard",
          {
            headers: {
              "Content-Type": "application/json",
              ...AuthService.getAuthHeaders(),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/dashbg.jpg')`, // ✅ replace with your image path
      }}
    >
      <div className="p-6 space-y-6 backdrop-blur-sm bg-white/10 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to NKS Traders Admin Panel
            </p>
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
            value={stats?.orders.total ?? "--"}
            icon={<Users className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-r from-cyan-500 to-teal-500"
          />
          <StatCard
            title="Total Products"
            value={stats?.products.total ?? "--"}
            icon={<Tags className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-r from-purple-500 to-indigo-500"
          />
          <StatCard
            title="Total Shops"
            value={stats?.users.shopOwners ?? "--"}
            icon={<Handshake className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-r from-orange-500 to-red-500"
          />
          <StatCard
            title="Active Users"
            value={stats?.users.total ?? "--"}
            icon={<Coins className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-r from-pink-500 to-fuchsia-500"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white/80 rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  New order received
                </span>
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

          {/* Quick Actions */}
          <div className="bg-white/80 rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition">
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats
                    ? stats.users.total -
                      (stats.users.shopOwners +
                        stats.users.electricians +
                        stats.users.admins)
                    : "--"}
                </p>
                <span className="text-green-600 text-sm font-medium">+25%</span>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition">
                <p className="text-sm text-gray-600">Total Shop Owners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.users.shopOwners ?? "--"}
                </p>
                <span className="text-green-600 text-sm font-medium">+12%</span>
              </div>
            </div>

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
    </div>
  );
};

export default Dashboard;
