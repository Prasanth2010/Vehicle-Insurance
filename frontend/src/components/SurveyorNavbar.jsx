// src/components/SurveyorNavbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function SurveyorNavbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigation = [
    { name: 'Dashboard', href: '/surveyor/panel', icon: HomeIcon },
    { name: 'Assigned Claims', href: '/surveyor/claims', icon: ClipboardDocumentCheckIcon },
    { name: 'Completed Reports', href: '/surveyor/reports', icon: DocumentTextIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/surveyor/login');
  };

  const goToProfile = () => {
    navigate('/surveyor/profile'); 
  };
  const gotoPanel =()=>{
    navigate('/surveyor/panel'); 
  };

  if (!user || user.role !== 'SURVEYOR') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <button onClick={gotoPanel} className="flex items-center gap-3">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InsurePro</h1>
                <p className="text-xs text-gray-500">Surveyor Portal</p>
              </div> */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">InsurePro</span>
            <p className="text-xs text-gray-500">Surveyor Portal</p>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.href
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Profile + Logout */}
          <div className="flex items-center gap-6">
            {/* Profile Button */}
            <button
              onClick={goToProfile}
              className="hidden md:flex items-center gap-3 rounded-xl px-5 py-3 transition-all shadow-sm group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase() || ''}
                </span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName || ''}
                </p>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Profile */}
            <button
              onClick={() => {
                goToProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-2xl">
                  {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase() || ''}
                </span>
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900">
                  {user.firstName} {user.lastName || ''}
                </p>
                <p className="text-sm text-gray-500">Field Surveyor • View Profile</p>
              </div>
            </button>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.href
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}