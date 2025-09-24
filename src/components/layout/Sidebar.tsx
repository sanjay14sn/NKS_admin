import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  Package,
  Users,
  Wrench,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const linkClass =
    "flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700";

  const activeClass = "bg-[#d0f0ef] text-[#0f6b68] font-medium";

  return (
    <div className="w-64 h-full shadow-md flex flex-col bg-white">
      {/* Brand */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#0f6b68]">NKS Traders</h1>
        <p className="text-xs text-[#0f6b68]">Nks•Members</p>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Main Menu
          </p>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Boxes size={18} />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <ShoppingBag size={18} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Package size={18} />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Users size={18} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/electricians"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Wrench size={18} />
            <span>Electricians/Owners</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
