// src/pages/user/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
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
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === 'ADMIN') navigate('/admin/panel');
      else if (role === 'SURVEYOR') navigate('/surveyor/panel');
      else navigate('/user/dashboard');
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
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Login</h1>
            <p className="text-gray-600 mt-2">Access your claims and policies</p>
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
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
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
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Create an account
            </Link>
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">HOME</Link>
            <span className="text-blue-600 font-medium underline">USER PORTAL</span>
            <Link to="/admin/login" className="text-gray-600 hover:text-gray-900">ADMIN PORTAL</Link>
            <Link to="/surveyor/login" className="text-gray-600 hover:text-gray-900">SURVEYOR PORTAL</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import Header from '../../components/Header';

// export default function Login() {
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
//       const res = await axios.post('http://localhost:8080/auth/login', formData);
      
//       // Store user in localStorage
//       localStorage.setItem('user', JSON.stringify(res.data.user));

//       // Redirect based on role
//       const role = res.data.user.role;
//       if (role === 'ADMIN') {
//         navigate('/admin/panel');
//       } else if (role === 'SURVEYOR') {
//         navigate('/surveyor/panel');
//       } else {
//         navigate('/user/dashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <Header />
      
//       <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
//         <div className="w-full max-w-md">
//           {/* Login Card */}
//           <div className="glass-card rounded-2xl shadow-xl p-8">
//             {/* Logo & Header */}
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <span className="text-white text-2xl font-bold">🚗</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-gray-600">
//                 Sign in to your InsurePro account
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
//                     placeholder="Enter your email"
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
//                     placeholder="Enter your password"
//                     className="input-field pl-10"
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     🔒
//                   </div>
//                 </div>
//                 <div className="flex justify-end mt-2">
//                   <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
//                     Forgot password?
//                   </a>
//                 </div>
//               </div>

//               {/* <div className="flex items-center">
//                 <input 
//                   type="checkbox" 
//                   id="remember" 
//                   className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
//                 />
//                 <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
//                   Remember me for 30 days
//                 </label>
//               </div> */}

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
//                 ) : 'Sign In to Your Account'}
//               </button>
//             </form>

            
            
//             {/* Registration Link */}
//             <div className="mt-4 pt-2 border-t border-gray-200 text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
//                   Sign up for free
//                 </Link>
//               </p>
//             </div>


//             {/* Divider */}
//             <div className="my-2 flex items-center">
//               <div className="flex-1 border-t border-gray-200"></div>
//               {/* <span className="px-4 text-sm text-gray-500">OR</span> */}
//               <div className="flex-1 border-t border-gray-200"></div>
//             </div>

//             {/* Admin Login */}
//             <div className="text-center">
//               <Link
//                 to="/admin/login"
//                 className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
//               >
//                 <span className="mr-2">👨‍💼</span>
//                 Are you an admin? Sign in here
//               </Link>
//             </div>
//             <div>
//               <p className="text-center">
//               <Link to="/surveyor/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
//                  Are you an Surveyor? Sign in here
//               </Link>
//             </p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }