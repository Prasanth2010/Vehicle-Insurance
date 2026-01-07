// src/pages/user/UserPolicies.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function UserPolicies() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/policies`);
        setPolicies(res.data || []);
      } catch (err) {
        console.error('Failed to fetch policies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className=" mx-auto px-6 py-20 mt-4">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center gap-3 text-gray-600 hover:text-blue-700 mb-10 font-medium text-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Policies</h1>
        <p className="text-lg text-gray-600 mb-12">View all available insurance policies</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-6 border-blue-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600">Loading policies...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-20 text-center">
            <div className="text-7xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Policies Available</h3>
            <p className="text-gray-600">Check back later for new insurance plans.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {policies.map(policy => (
              <div key={policy.id} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{policy.name}</h3>
                    <p className="text-gray-600 mt-2">{policy.description}</p>
                  </div>
                  <span className="px-5 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-800 rounded-full font-bold">
                    {policy.plan}
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-2">Annual Premium</p>
                  <p className="text-4xl font-bold text-gray-900">₹{policy.premiumAmount}</p>
                </div>

                <button
                  onClick={() => navigate('/user/new-claim', { state: { policy } })}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                  File Claim →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}