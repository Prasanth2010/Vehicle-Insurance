import { Link, useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (!user.id || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <nav className="gradient-secondary shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/panel" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-white font-bold text-xl">InsurePro</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/admin/panel" icon="📊">Dashboard</NavLink>
            <NavLink to="/admin/add-policy" icon="📋">Add Policy</NavLink>
            <NavLink to="/admin/policies" icon="📄">Policies</NavLink>
            <NavLink to="/admin/Coverages" icon="📝">Coverages</NavLink>
            <NavLink to="/admin/claims" icon="⚡">Claims</NavLink>
            <NavLink to="/admin/register-admin" icon="👨‍💼">Admin</NavLink>
            <NavLink to="/admin/register-surveyor" icon="🔍">Surveyor</NavLink>
            <NavLink to="/admin/customers" icon="👥">Customers</NavLink>
            <NavLink to="/admin/surveyors" icon="👷">Surveyors</NavLink>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user.firstName}</p>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg 
                       transition-all duration-200 text-sm font-medium flex items-center space-x-2"
            >
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper component for nav links
function NavLink({ to, icon, children }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 
                 rounded-lg transition-all duration-200 flex items-center space-x-2 
                 text-sm font-medium"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}