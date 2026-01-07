import { useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { FaUserShield, FaEnvelope, FaLock, FaPhone, FaUser, FaVenusMars, FaMapMarkerAlt, FaCity, FaHashtag } from 'react-icons/fa';

export default function RegisterAdmin() {
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  setMessageType('');

  try {
    await axios.post('http://localhost:8080/admin/register-admin', formData);
    setMessage('Admin account created successfully!');
    setMessageType('success');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Failed to create admin account');
    setMessageType('error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container-padding py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl mb-6">
              <FaUserShield className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Register New Administrator
            </h1>
            <p className="text-gray-600">
              Create a new administrator account for the insurance management system
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaUserShield className="text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    Administrator Account Created
                  </h3>
                  <pre className="text-sm text-emerald-700 whitespace-pre-wrap bg-emerald-100/50 p-4 rounded-lg">
                    {message}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600">⚠️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="glass-card rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="input-field pl-10"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="input-field pl-10"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="18"
                      max="100"
                      className="input-field pl-10"
                      placeholder="Enter age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="input-field pl-10"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaEnvelope className="mr-2 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field pl-10"
                        placeholder="admin@example.com"
                      />
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="input-field pl-10"
                        placeholder="Create a strong password"
                      />
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        required
                        className="input-field pl-10"
                        placeholder="Enter phone number"
                        pattern="[0-9]{10}"
                      />
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">10-digit number without spaces</p>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Enter street address"
                      />
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Enter city"
                      />
                      <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Enter pincode"
                        pattern="[0-9]{6}"
                      />
                      <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Note */}
              {/* <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserShield className="text-blue-600 text-sm" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Administrator Account Note
                    </h4>
                    <p className="text-sm text-blue-700">
                      This account will have full administrative privileges including access to all system features, user management, claims processing, and policy management.
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
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
                      setMessage('');
                      setError('');
                    }}
                    className="btn-secondary py-3 px-8"
                    disabled={loading}
                  >
                    Clear All
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary py-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Creating Admin Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaUserShield className="mr-2" />
                        Create Administrator Account
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Security Note */}
          {/* <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaLock className="text-gray-500" />
                </div>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Security Guidelines</p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Share credentials securely via encrypted channels</li>
                  <li>• Advise the new admin to change password on first login</li>
                  <li>• Monitor admin activities regularly</li>
                  <li>• Revoke access immediately if suspicious activity is detected</li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}