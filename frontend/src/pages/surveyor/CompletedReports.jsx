// src/pages/surveyor/CompletedReports.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SurveyorNavbar from '../../components/SurveyorNavbar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CompletedReports() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [completedClaims, setCompletedClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'SURVEYOR') {
      navigate('/login');
      return;
    }

    const fetchCompleted = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/claims/surveyor/${user.id}`);
        const completed = res.data.filter(claim => claim.status === 'SURVEY_COMPLETED');
        setCompletedClaims(completed);
      } catch (err) {
        console.error('Failed to fetch completed reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [user, navigate]);

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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Completed Survey Reports</h1>
        <p className="text-lg text-gray-600 mb-10">Your submitted survey reports awaiting final decision</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-6 border-indigo-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600">Loading reports...</p>
          </div>
        ) : completedClaims.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Completed Reports Yet</h3>
            <p className="text-gray-600">Your completed surveys will appear here after submission.</p>
          </div>
        ) : (
          <div className="max-w-2xl space-y-8">
            {completedClaims.map(claim => (
              <div key={claim.id} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 ">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{claim.policy?.name}</h3>
                    <p className="text-gray-600 mt-1">
                      Customer: {claim.user?.firstName} {claim.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Survey Completed: {new Date(claim.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-6 py-3 bg-purple-100 text-purple-800 rounded-full font-bold">
                    Survey Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Your Recommendation</p>
                    <p className={`text-xl font-bold ${claim.recommendation === 'APPROVED' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {claim.recommendation === 'APPROVED' ? '✓ Approve Claim' : '✗ Reject Claim'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Amount</p>
                    <p className="text-3xl font-bold text-gray-900">₹{claim.recommendedAmount || 0}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Survey Report Summary</p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl">
                    {claim.surveyReport || 'No report summary available.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}