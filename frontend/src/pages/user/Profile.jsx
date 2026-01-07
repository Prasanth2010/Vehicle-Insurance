// src/pages/user/Profile.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    street: '',
    city: '',
    pincode: ''
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // Show loading spinner

  // Fetch fresh user data from backend on mount
  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
  try {
    setLoading(true);
    const response = await axios.get('http://localhost:8080/api/profile/me');

    const freshUser = response.data;

    setProfileData({
      firstName: freshUser.firstName || '',
      lastName: freshUser.lastName || '',
      email: freshUser.email || '',
      contactNo: freshUser.contactNo || '',
      street: freshUser.street || '',
      city: freshUser.city || '',
      pincode: freshUser.pincode || ''
    });
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    setMessage('Failed to load profile data');
    // Fallback to localStorage
    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      contactNo: user.contactNo || '',
      street: user.street || '',
      city: user.city || '',
      pincode: user.pincode || ''
    });
  } finally {
    setLoading(false);
  }
};

    fetchProfile();
  }, [user?.id, navigate]);

  const handleSave = async () => {
  setMessage('');
  setSaving(true);

  try {
    await axios.put('http://localhost:8080/api/profile/me', profileData);

    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setMessage('✅ Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 5000);
  } catch (err) {
    setMessage(`❌ Failed to update: ${err.response?.data?.message || err.message}`);
  } finally {
    setSaving(false);
  }
};

  const goToDashboard = () => {
    navigate('/user/dashboard');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-6 border-blue-600 border-t-transparent"></div>
          <p className="mt-8 text-xl text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-20 mt-4">
        {/* Back Button */}
        <button
          onClick={goToDashboard}
          className="flex items-center gap-3 text-gray-600 hover:text-blue-700 mb-10 font-medium text-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
          Back to Dashboard
        </button>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                  <span className="text-white font-bold text-6xl">
                    {profileData.firstName?.charAt(0).toUpperCase()}{profileData.lastName?.charAt(0).toUpperCase() || ''}
                  </span>
                </div>
                <div>
                  <h1 className="text-5xl font-bold">
                    {profileData.firstName} {profileData.lastName || ''}
                  </h1>
                  <p className="text-2xl mt-3 opacity-90">{profileData.email}</p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-4 px-10 py-5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl transition-all shadow-xl border border-white/30"
                >
                  <PencilIcon className="w-7 h-7" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-5">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-10 py-5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl transition-all border border-white/30"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-4 px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl disabled:opacity-70"
                  >
                    <CheckCircleSolid className="w-7 h-7" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mx-10 mt-8 p-6 rounded-2xl border-2 text-center text-xl font-medium ${message.includes('✅') ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Profile Form Fields */}
          <div className="p-10 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {/* First Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.contactNo}
                  onChange={(e) => setProfileData({ ...profileData, contactNo: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+91 98765 43210"
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">Street Address</label>
                <input
                  type="text"
                  value={profileData.street}
                  onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>

              {/* Pincode - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-700 mb-4">Pincode</label>
                <input
                  type="text"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}