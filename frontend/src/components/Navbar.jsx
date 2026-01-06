

import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Hide navbar if not logged in or if admin (admin has own navbar)
  if (!user || !user.id || user.role === 'ADMIN') {
    return null;
  }
const goToProfile = () => {
    navigate('/user/profile'); 
  };
  return (
    <nav className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/user/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">InsurePro</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/user/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/user/claims"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <span className="text-xl">📄</span>
              <span>My Claims</span>
            </Link>

            <Link to="/user/policies"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <span className="text-xl">📋</span>
              <span>Policies</span>
            </Link>
          </div>

          {/* Profile & Logout */}
          <div className="flex items-center space-x-6">
            {/* Profile Button - Clickable */}
            <button
              onClick={goToProfile}
              className="flex items-center space-x-3 hover:bg-gray-100 rounded-xl px-4 py-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase() || ''}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName || ''}
                </p>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5  text-black rounded-xl font-medium transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}