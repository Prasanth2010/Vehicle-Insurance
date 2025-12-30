import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/admin/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/panel');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="flex items-center pt-12 justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="glass-card rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-600">
                Sign in to manage the insurance system
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="input-field pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <div  className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                  <div className="ml-2 text-sm text-gray-600"></div>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in to Admin Panel'}
              </button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium mb-1">Demo Credentials</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                  admin@example.com / admin123
                </p>
              </div>
            </div> */}

            {/* Footer */}
            {/* <p className="text-center text-sm text-gray-500 mt-8">
              Need help?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact support
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}