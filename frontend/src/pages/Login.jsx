import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Login() {
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
      const res = await axios.post('http://localhost:8080/auth/login', formData);
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'ADMIN') {
        navigate('/admin/panel');
      } else if (role === 'SURVEYOR') {
        navigate('/surveyor/panel');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="glass-card rounded-2xl shadow-xl p-8">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🚗</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your InsurePro account
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    className="input-field pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me for 30 days
                </label>
              </div> */}

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
                ) : 'Sign In to Your Account'}
              </button>
            </form>

            
            
            {/* Registration Link */}
            <div className="mt-4 pt-2 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up for free
                </Link>
              </p>
            </div>


            {/* Divider */}
            <div className="my-2 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              {/* <span className="px-4 text-sm text-gray-500">OR</span> */}
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Admin Login */}
            <div className="text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <span className="mr-2">👨‍💼</span>
                Are you an admin? Sign in here
              </Link>
            </div>
            <div>
              <p className="text-center">
              <Link to="/surveyor/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                 Are you an Surveyor? Sign in here
              </Link>
            </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}