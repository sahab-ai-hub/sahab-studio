import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiGrid, FiUser } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            🎨 Sahab Studio
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiHome /> Dashboard
            </Link>
            <Link to="/templates" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiGrid /> Templates
            </Link>
            <Link to="/subscription" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiUser /> Subscription
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
