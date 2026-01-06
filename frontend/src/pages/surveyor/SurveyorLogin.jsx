// src/pages/surveyor/SurveyorLogin.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function SurveyorLogin() {
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
      const res = await axios.post('http://localhost:8080/auth/login', formData);
      const user = res.data.user;
      if (user.role !== 'SURVEYOR') {
        setError('Access denied. Surveyor login required.');
        setLoading(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/surveyor/panel');
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
            <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Surveyor Portal</h1>
            <p className="text-gray-600 mt-2">Field officer verification access</p>
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
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-yellow-600 hover:text-yellow-700">Forgot password?</a>
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
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70"
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
            <Link to="/admin/login" className="text-gray-600 hover:text-gray-900">ADMIN PORTAL</Link>
            <span className="text-yellow-600 font-medium underline">SURVEYOR PORTAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon, KeyIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// export default function SurveyorLogin() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError(''); // Clear error when user starts typing
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await axios.post('http://localhost:8080/auth/login', formData);
//       const user = res.data.user;

//       if (user.role !== 'SURVEYOR') {
//         setError('Access denied. Surveyor credentials required.');
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('token', res.data.token);
//       navigate('/surveyor/panel');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo/Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
//             <ShieldCheckIcon className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Surveyor</h1>
//           <p className="text-gray-600">Professional claims assessment portal</p>
//         </div>

//         {/* Login Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Surveyor Login</h2>
//             <p className="text-gray-600">Access your claims assessment dashboard</p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
//               <div className="flex items-center gap-2 text-red-700">
//                 <ShieldCheckIcon className="w-5 h-5" />
//                 <span className="font-medium">{error}</span>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <UserCircleIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
//                   placeholder="surveyor@company.com"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   {showPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <KeyIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                   placeholder="Enter your password"
//                 />
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             {/* <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <a
//                 href="/forgot-password"
//                 className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Forgot password?
//               </a>
//             </div> */}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Authenticating...
//                 </div>
//               ) : (
//                 'Sign in as Surveyor'
//               )}
//             </button>
//           </form>
//           <div className="mt-8 text-center space-y-3">
//           <Link
//             to="/admin/login"
//             className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
//           >
//             ← Admin Login
//           </Link>
          
//         </div>

//           {/* Divider */}
//           {/* <div className="mt-8 pt-6 border-t border-gray-200">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">Need help?</span>
//               </div>
//             </div>
//             <p className="mt-4 text-center text-sm text-gray-600">
//               Contact your administrator for account issues
//             </p>
//           </div> */}
//         </div>

//         {/* Footer Links */}
        

//         {/* Demo Credentials (remove in production) */}
//         {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//           <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h4>
//           <div className="text-xs text-blue-800 space-y-1">
//             <p>Email: surveyor@insurance.com</p>
//             <p>Password: (Created by Admin)</p>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// }