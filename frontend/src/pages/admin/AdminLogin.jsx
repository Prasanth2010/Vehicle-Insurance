// src/pages/admin/AdminLogin.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8080/admin/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/panel');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
            <p className="text-gray-600 mt-2">System administration portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">HOME</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900">USER PORTAL</Link>
            <span className="text-purple-600 font-medium underline">ADMIN PORTAL</span>
            <Link to="/surveyor/login" className="text-gray-600 hover:text-gray-900">SURVEYOR PORTAL</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await axios.post('http://localhost:8080/admin/login', formData);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       navigate('/admin/panel');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <Header />
      
//       <div className="flex items-center pt-12 justify-center min-h-[calc(100vh-80px)] p-4">
//         <div className="w-full max-w-md">
//           {/* Login Card */}
//           <div className="glass-card rounded-2xl shadow-xl p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <span className="text-white text-2xl font-bold">A</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Admin Portal
//               </h1>
//               <p className="text-gray-600">
//                 Sign in to manage the insurance system
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <div className="flex items-center">
//                   <span className="text-red-500 mr-2">⚠️</span>
//                   <p className="text-red-700 text-sm">{error}</p>
//                 </div>
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="admin@example.com"
//                     className="input-field pl-10"
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     📧
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     name="password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="••••••••"
//                     className="input-field pl-10"
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     🔒
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center">
//                   <div  className="h-4 w-4 text-blue-600 rounded border-gray-300" />
//                   <div className="ml-2 text-sm text-gray-600"></div>
//                 </label>
//                 <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
//                   Forgot password?
//                 </a>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full btn-primary py-3 text-base disabled:opacity-50"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                     </svg>
//                     Signing in...
//                   </span>
//                 ) : 'Sign in to Admin Panel'}
//               </button>
//             </form>

//             {/* Demo Credentials */}
//             {/* <div className="mt-8 pt-6 border-t border-gray-200">
//               <div className="text-center text-sm text-gray-600">
//                 <p className="font-medium mb-1">Demo Credentials</p>
//                 <p className="font-mono text-xs bg-gray-100 p-2 rounded">
//                   admin@example.com / admin123
//                 </p>
//               </div>
//             </div> */}

//             {/* Footer */}
//             {/* <p className="text-center text-sm text-gray-500 mt-8">
//               Need help?{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
//                 Contact support
//               </a>
//             </p> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }