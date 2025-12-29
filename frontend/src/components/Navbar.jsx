import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || !user.id || user.role === 'ADMIN') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
      <div className="container-padding">
        <div className="flex items-center justify-between h-16 px-5">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <span className="text-gray-900 font-bold text-lg">InsurePro</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/user/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm 
                       flex items-center space-x-1"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/user/dashboard#claims"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm 
                       flex items-center space-x-1"
            >
              <span>⚡</span>
              <span>My Claims</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 
                         text-gray-700 rounded-lg transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}