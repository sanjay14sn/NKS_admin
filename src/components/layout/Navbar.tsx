// src/components/layout/Navbar.tsx
import React from "react";
import { Search, Bell, Plus } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void; // optional for mobile
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className="bg-white px-6 py-3 flex items-center justify-between border-b shadow-sm">
      {/* Sidebar toggle (mobile only) */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        onClick={onToggleSidebar}
      >
        ☰
      </button>

      {/* Search Bar */}
     <div className="flex items-center w-1/3">
  <div className="relative w-full">
    <Search className="absolute left-3 top-3 text-black" size={18} />
    <input
      type="text"
      placeholder="Search"
      className="w-full pl-10 pr-4 py-4 rounded-xl bg-[#d0f0ef] text-sm text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
  </div>
</div>


      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        {/* Add New */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Plus size={18} className="text-gray-600" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://via.placeholder.com/32"
            alt="User Avatar"
            className="w-9 h-9 rounded-full border-2 border-orange-400"
          />
          <span className="text-sm font-medium text-gray-700">Mike Johnson</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
