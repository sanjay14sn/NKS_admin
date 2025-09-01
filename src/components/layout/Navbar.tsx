import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onToggleSidebar?: () => void; // optional if you want sidebar toggle
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Sidebar toggle for mobile */}
      <button
        className="md:hidden text-white mr-4"
        onClick={onToggleSidebar}
      >
        ☰
      </button>

      {/* Logo / Brand */}
      <div className="text-xl font-bold">
        <Link to="/">MyShop</Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-6 text-sm">
        <li><Link to="/" className="hover:text-gray-300 transition">Dashboard</Link></li>
        <li><Link to="/products" className="hover:text-gray-300 transition">Products</Link></li>
        <li><Link to="/orders" className="hover:text-gray-300 transition">Orders</Link></li>
        <li><Link to="/categories" className="hover:text-gray-300 transition">Categories</Link></li>
      </ul>

      {/* Profile / User */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Admin</span>
        <img
          src="https://via.placeholder.com/32"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border border-gray-600"
        />
      </div>
    </nav>
  );
};

export default Navbar;
