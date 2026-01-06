import { Link } from 'react-router-dom';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Hide header if user is logged in (navbar takes over)
  if (user && user.id) {
    return null;
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-100">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">InsurePro</h1>
              <p className="text-sm text-gray-500 -mt-1">Vehicle Insurance Platform</p>
            </div>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 border border-blue-200"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 shadow-md"
            >
              Login 
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// import { Link } from 'react-router-dom';

// export default function Header() {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');

//   if (user && user.id) {
//     return null;
//   }

//   return (
//     <header className="gradient-secondary shadow-lg">
//       <div className="container-padding">
//         <div className="flex items-center justify-between h-20 px-5">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center">
//               <span className="text-white font-bold text-2xl">I</span>
//             </div>
//             <div>
//               <h1 className="text-white font-bold text-2xl">InsurePro</h1>
//               <p className="text-gray-400 text-sm">Vehicle Insurance</p>
//             </div>
//           </Link>

//           {/* Auth Links */}
//           <div className="flex items-center space-x-4 px-5">
//             <Link
//               to="/register"
//               className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white 
//                        rounded-lg transition-all duration-200 font-medium"
//             >
//               Get Started
//             </Link>
//             <Link
//               to="/login"
//               className="btn-primary py-2.5"
//             >
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }