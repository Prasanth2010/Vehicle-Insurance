import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, KeyIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SurveyorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/auth/login', formData);
      const user = res.data.user;

      if (user.role !== 'SURVEYOR') {
        setError('Access denied. Surveyor credentials required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', res.data.token);
      navigate('/surveyor/panel');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Surveyor</h1>
          <p className="text-gray-600">Professional claims assessment portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Surveyor Login</h2>
            <p className="text-gray-600">Access your claims assessment dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <ShieldCheckIcon className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="surveyor@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </a>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'Sign in as Surveyor'
              )}
            </button>
          </form>
          <div className="mt-8 text-center space-y-3">
          <Link
            to="/admin/login"
            className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Admin Login
          </Link>
          
        </div>

          {/* Divider */}
          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Need help?</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Contact your administrator for account issues
            </p>
          </div> */}
        </div>

        {/* Footer Links */}
        

        {/* Demo Credentials (remove in production) */}
        {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h4>
          <div className="text-xs text-blue-800 space-y-1">
            <p>Email: surveyor@insurance.com</p>
            <p>Password: (Created by Admin)</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}