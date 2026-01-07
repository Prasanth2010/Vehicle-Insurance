// src/pages/surveyor/AssignedClaims.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SurveyorNavbar from '../../components/SurveyorNavbar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AssignedClaims() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'SURVEYOR') {
      navigate('/login');
      return;
    }

    const fetchAssignedClaims = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/claims/surveyor/${user.id}`);
        // Only show claims that are IN_REVIEW (assigned but not completed)
        const assigned = res.data.filter(claim => claim.status === 'IN_REVIEW');
        setClaims(assigned);
      } catch (err) {
        console.error('Failed to fetch assigned claims:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedClaims();
  }, [user, navigate]);

  const goToReview = (claim) => {
    navigate('/surveyor/review-claim', { state: { claim } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyorNavbar />

      <div className=" mx-auto px-6 py-20 mt-4">
        <button
          onClick={() => navigate('/surveyor/panel')}
          className="flex items-center gap-3 text-gray-600 hover:text-indigo-700 mb-10 font-medium text-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Assigned Claims</h1>
        <p className="text-lg text-gray-600 mb-10">Review and submit survey reports for these claims</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-6 border-indigo-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600">Loading assigned claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Claims Assigned Yet</h3>
            <p className="text-gray-600">New claims will appear here when assigned by admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {claims.map(claim => (
              <div key={claim.id} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{claim.policy?.name || 'Unknown Policy'}</h3>
                    <p className="text-gray-600 mt-1">
                      Customer: {claim.user?.firstName} {claim.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted: {new Date(claim.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-5 py-2 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">
                    Pending Review
                  </span>
                </div>

                <p className="text-gray-700 mb-6 line-clamp-3">{claim.description}</p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Claimed Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => goToReview(claim)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all"
                  >
                    Start Review →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}