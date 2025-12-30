import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SurveyorNavbar from '../../components/SurveyorNavbar'; // Create separate navbar for surveyor
import { 
  ClipboardDocumentCheckIcon, 
  UserIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function SurveyorPanel() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const surveyor = storedUser ? JSON.parse(storedUser) : null;
  const [assignedClaims, setAssignedClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    fetchAssignedClaims();
  }, []);

  const fetchAssignedClaims = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/claims');
      const assigned = res.data.filter(c => c.status === 'ASSIGNED');
      setAssignedClaims(assigned);
      
      // Calculate statistics
      setStats({
        total: assigned.length,
        pending: assigned.filter(c => !c.surveyReport).length,
        completed: assigned.filter(c => c.surveyReport).length
      });
    } catch (err) {
      console.error('Error fetching claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = (claimId) => {
    navigate(`/surveyor/submit-report/${claimId}`);
  };

  if (!surveyor || surveyor.role !== 'SURVEYOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-6">Surveyor credentials required to access this panel.</p>
          <button
            onClick={() => navigate('/surveyor/login')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Go to Surveyor Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Create a SurveyorNavbar component similar to AdminNavbar */}
      <SurveyorNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Surveyor Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="text-blue-600 font-semibold capitalize">{surveyor.firstName} {surveyor.lastName}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium">
                Surveyor ID: {surveyor.id}
              </div>
              <button
                onClick={() => navigate('/surveyor/profile')}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <UserIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">Total Assigned</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Claims Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assigned Claims</h2>
              <p className="text-gray-600">Claims assigned to you for assessment</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search claims..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : assignedClaims.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Assigned Claims</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any claims assigned to you at the moment. 
                New assignments will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assignedClaims.map(claim => (
                <div key={claim.id} className="bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-3">
                        Claim #{claim.id}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{claim.policy?.name || 'Insurance Claim'}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                      ASSIGNED
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <span className="font-medium">Policyholder:</span> {claim.user?.firstName} {claim.user?.lastName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <span className="font-medium">Submitted:</span> {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex items-start gap-3">
                        <DocumentTextIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>{claim.description || 'No description provided'}</span>
                      </div>
                    </div>

                    {claim.damagePhotoPath && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                          <PhotoIcon className="w-4 h-4" />
                          <span className="font-medium">Damage Photos</span>
                        </div>
                        <img 
                          src={`http://localhost:8080${claim.damagePhotoPath}`} 
                          alt="Damage" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleSubmitReport(claim.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                      >
                        <DocumentTextIcon className="w-5 h-5" />
                        Submit Report
                      </button>
                      <button
                        onClick={() => navigate(`/surveyor/claim-details/${claim.id}`)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">Check our surveyor guidelines</p>
            <a href="/surveyor/guidelines" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View Guidelines →
            </a>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Report Templates</h4>
            <p className="text-sm text-gray-600 mb-3">Download survey report templates</p>
            <a href="/surveyor/templates" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Download →
            </a>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Contact Support</h4>
            <p className="text-sm text-gray-600 mb-3">Get help from admin team</p>
            <a href="mailto:support@insurance.com" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Email Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}