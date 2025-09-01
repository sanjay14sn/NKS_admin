// src/components/layout/Sidebar.tsx
import React from "react";
import { LayoutDashboard, Boxes, ShoppingBag, Users } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white h-full shadow-md flex flex-col">
      {/* Brand / App Name */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">CatDash™</h1>
        <p className="text-xs text-gray-500">Cat Company • 12 Members</p>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Main Menu
          </p>

          <a
            href="/dashboard"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>

          <a
            href="/categories"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Boxes size={18} />
            <span>Categories</span>
          </a>

          <a
            href="/products"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <ShoppingBag size={18} />
            <span>Products</span>
          </a>

          <a
            href="/orders"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Users size={18} />
            <span>Orders</span>
          </a>
        </nav>
      </div>

      {/* Departments / Categories */}
      <div className="p-4 border-t">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Categories
        </p>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Food & Treats</span>
          </li>
          <li className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Toys</span>
          </li>
          <li className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Accessories</span>
          </li>
          <li className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Health & Care</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
