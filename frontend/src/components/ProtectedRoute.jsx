// src/components/ProtectedRoute.jsx

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    // If no user → redirect to login
    if (!user || !user.id) {
      navigate('/login', { replace: true });
      return;
    }

    // If role not allowed → redirect to login
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate('/login', { replace: true });
      return;
    }
  }, [user, navigate, allowedRoles]);

  // If user is logged in and has correct role → show page
  if (!user || !user.id || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-6 border-blue-600 border-t-transparent"></div>
      <p className="mt-6 text-gray-600">Checking authentication...</p>
    </div>
  </div>
);
  }

  return children;
}