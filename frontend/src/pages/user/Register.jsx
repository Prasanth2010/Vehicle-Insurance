// src/pages/user/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNo: '',
    age: '',
    gender: 'Male',
    street: '',
    city: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const nextStep = () => {
    const error = validateStep1();
    if (error) {
      setMessage(error);
      setMessageType('error');
      return;
    }
    setMessage('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:8080/auth/register', formData);

      setMessage('Account created successfully! Redirecting to login...');
      setMessageType('success');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Registration Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-6a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h2>
          <p className="text-center text-gray-600 mb-8">Join InsurePro and protect your vehicle today</p>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border text-center ${
              messageType === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className="w-24 h-1 bg-gray-200 mx-2">
              <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.656-1.344 3-3 3s-3-1.344-3-3 1.344-3 3-3 3 1.344 3 3zM12 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Continue →
                </button>
              </>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Coimbatore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="641001"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Bottom Navigation Tabs */}
        <div className="flex justify-center mt-8 space-x-4 text-sm font-medium">
          <Link to="/" className="text-gray-500 hover:text-gray-900">HOME</Link>
          <span className="text-blue-600 border-b-2 border-blue-600 pb-1">USER PORTAL</span>
          <Link to="/admin/login" className="text-gray-500 hover:text-gray-900">ADMIN PORTAL</Link>
          <Link to="/surveyor/login" className="text-gray-500 hover:text-gray-900">SURVEYOR PORTAL</Link>
        </div>
      </div>
    </div>
  );
}
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import Header from '../../components/Header';

// export default function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     contactNo: '',
//     age: '',
//     gender: '',
//     street: '',
//     city: '',
//     pincode: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validateStep1 = () => {
//     if (!formData.firstName.trim()) {
//       setError('First name is required');
//       return false;
//     }
//     if (!formData.lastName.trim()) {
//       setError('Last name is required');
//       return false;
//     }
//     if (!formData.email.trim()) {
//       setError('Email is required');
//       return false;
//     }
//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }
//     if (!formData.password) {
//       setError('Password is required');
//       return false;
//     }
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     setError('');
//     if (validateStep1()) {
//       setStep(2);
//     }
//   };

//   const handleBack = () => {
//     setStep(1);
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       // First, register the user
//       const res = await axios.post('http://localhost:8080/auth/register', formData);
      
//       // Show success message
//       setSuccess('Registration successful! Redirecting to login...');
      
//       // Clear the form
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         contactNo: '',
//         age: '',
//         gender: '',
//         street: '',
//         city: '',
//         pincode: ''
//       });
      
//       // Reset to step 1
//       setStep(1);
      
//       // Wait 2 seconds, then redirect to login page
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
      
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <Header />
      
//       <div className="container-padding py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <StepIndicator number={1} label="Personal Info" active={step === 1} completed={step > 1} />
//               <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
//               <StepIndicator number={2} label="Contact Details" active={step === 2} completed={step > 2} />
//             </div>
//           </div>

//           {/* Form Container */}
//           <div className="glass-card rounded-2xl shadow-xl p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <span className="text-white text-2xl font-bold">🚗</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Create Your InsurePro Account
//               </h1>
//               <p className="text-gray-600">
//                 Join thousands of satisfied customers protecting their vehicles
//               </p>
//             </div>

//             {/* Success Message */}
//             {success && (
//               <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
//                 <div className="flex items-center">
//                   <span className="text-emerald-500 mr-2">✅</span>
//                   <p className="text-emerald-700 text-sm">{success}</p>
//                 </div>
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <div className="flex items-center">
//                   <span className="text-red-500 mr-2">⚠️</span>
//                   <p className="text-red-700 text-sm">{error}</p>
//                 </div>
//               </div>
//             )}

//             {/* Step 1: Personal Information */}
//             {step === 1 && !success && (
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       required
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your first name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       required
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your last name"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       required
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your email address"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       required
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Create a strong password"
//                     />
//                     <p className="mt-2 text-xs text-gray-500">
//                       Must be at least 6 characters long
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Age
//                     </label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={formData.age}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your age"
//                       min="18"
//                       max="100"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Gender
//                     </label>
//                     <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleChange}
//                       className="input-field"
//                     >
//                       <option value="">Select gender</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                       <option value="Prefer not to say">Prefer not to say</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-gray-200">
//                   <button
//                     onClick={handleNext}
//                     className="w-full btn-primary py-3"
//                   >
//                     Continue to Contact Details →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Contact Details */}
//             {step === 2 && !success && (
//               <form onSubmit={handleSubmit}>
//                 <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Details</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number *
//                     </label>
//                     <input
//                       type="tel"
//                       name="contactNo"
//                       required
//                       value={formData.contactNo}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your phone number"
//                       pattern="[0-9]{10}"
//                       title="Please enter a valid 10-digit phone number"
//                     />
//                     <p className="mt-1 text-xs text-gray-500">10-digit number without spaces</p>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Street Address
//                     </label>
//                     <input
//                       type="text"
//                       name="street"
//                       value={formData.street}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your street address"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter your city"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Pincode
//                     </label>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       className="input-field"
//                       placeholder="Enter pincode"
//                       pattern="[0-9]{6}"
//                       title="Please enter a valid 6-digit pincode"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-gray-200">
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <button
//                       type="button"
//                       onClick={handleBack}
//                       className="btn-secondary py-3"
//                     >
//                       ← Back to Personal Info
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="flex-1 btn-primary py-3 disabled:opacity-50"
//                     >
//                       {loading ? (
//                         <span className="flex items-center justify-center">
//                           <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                           </svg>
//                           Creating Account...
//                         </span>
//                       ) : 'Complete Registration'}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             )}

//             {/* Login Link */}
//             <div className="mt-8 pt-6 border-t border-gray-200 text-center">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Benefits */}
//           {/* {!success && (
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <BenefitCard
//                 icon="🛡️"
//                 title="Full Protection"
//                 description="Comprehensive coverage for all vehicle types"
//               />
//               <BenefitCard
//                 icon="⚡"
//                 title="Quick Claims"
//                 description="Fast claim processing with minimal paperwork"
//               />
//               <BenefitCard
//                 icon="💰"
//                 title="Best Rates"
//                 description="Competitive pricing with flexible payment options"
//               />
//             </div>
//           )} */}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StepIndicator({ number, label, active, completed }) {
//   return (
//     <div className="flex flex-col items-center">
//       <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
//         active ? 'bg-blue-600 text-white' :
//         completed ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600' :
//         'bg-gray-100 text-gray-400'
//       }`}>
//         {completed ? '✓' : number}
//       </div>
//       <span className={`text-sm font-medium ${
//         active ? 'text-blue-600' :
//         completed ? 'text-emerald-600' :
//         'text-gray-400'
//       }`}>
//         {label}
//       </span>
//     </div>
//   );
// }

// function BenefitCard({ icon, title, description }) {
//   return (
//     <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
//       <div className="text-2xl mb-2">{icon}</div>
//       <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
//       <p className="text-sm text-gray-600">{description}</p>
//     </div>
//   );
// }