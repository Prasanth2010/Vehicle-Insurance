// src/pages/user/MyClaims.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function MyClaims() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    const fetchClaims = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/claims/my?userId=${user.id}`);
        // Sort by newest first
        const sortedClaims = res.data.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
        setClaims(sortedClaims);
      } catch (err) {
        console.error('Failed to fetch claims:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-800';
      case 'SURVEY_COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (claim) => {
    switch (claim.status) {
      case 'APPROVED': return `Approved — ₹${claim.finalApprovedAmount || 0} Paid`;
      case 'REJECTED': return 'Rejected';
      case 'SURVEY_COMPLETED': return 'Survey Completed — Awaiting Final Decision';
      case 'IN_REVIEW': return 'Under Survey Review';
      case 'PENDING': return 'Pending Assignment';
      default: return 'Unknown';
    }
  };

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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Claims</h1>
        <p className="text-lg text-gray-600 mb-12">Track the status of all your submitted claims</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-6 border-blue-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600">Loading your claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-20 text-center">
            <div className="text-7xl mb-6">📄</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Claims Yet</h3>
            <p className="text-gray-600 mb-8">Submit your first claim to get started</p>
            <button
              onClick={() => navigate('/user/new-claim')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              Submit New Claim →
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {claims.map(claim => (
              <div key={claim.id} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{claim.policy?.name || 'Unknown Policy'}</h3>
                      <span className={`px-6 py-3 rounded-full font-bold ${getStatusBadge(claim.status)}`}>
                        {getStatusText(claim)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{claim.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                      <div>
                        <p className="text-gray-500">Claim ID</p>
                        <p className="font-semibold text-gray-900">#{claim.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(claim.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Claimed</p>
                        <p className="font-bold text-gray-900">
                          ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
                        </p>
                      </div>
                      {claim.finalApprovedAmount !== undefined && (
                        <div>
                          <p className="text-gray-500">Final Amount</p>
                          <p className="font-bold text-gray-900">₹{claim.finalApprovedAmount || 0}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {claim.damagePhotoPath && (
                    <div className="w-full lg:w-96">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Damage Photo</p>
                      <img
                        src={`http://localhost:8080${claim.damagePhotoPath}`}
                        alt="Damage"
                        className="w-full rounded-2xl border-4 border-gray-200 shadow-lg object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Photo+Not+Available'}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}