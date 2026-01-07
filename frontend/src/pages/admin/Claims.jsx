import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchClaims();
    fetchSurveyors();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/claims`);
      console.log('Claims fetched:', res.data);
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/claims/admin/surveyors`);
      console.log('Surveyors fetched:', res.data); // ← Check this in console!
      setSurveyors(res.data);
    } catch (err) {
      console.error('Failed to fetch surveyors:', err);
      setSurveyors([]);
    }
  };

  const assignToSurveyor = async (claimId, surveyorId) => {
    if (!surveyorId) {
      alert('Please select a surveyor');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/admin/claims/${claimId}/assign`, {
        surveyorId: parseInt(surveyorId)
      });

      // Find the surveyor from local list
      const assignedSurveyor = surveyors.find(s => s.id === parseInt(surveyorId));

      if (!assignedSurveyor) {
        alert('Surveyor not found in list');
        return;
      }

      // Update claim status and add surveyor info
      setClaims(prevClaims =>
        prevClaims.map(c =>
          c.id === claimId
            ? { ...c, status: 'IN_REVIEW', assignedSurveyor }
            : c
        )
      );

      alert('Claim successfully assigned to surveyor!');
    } catch (err) {
      console.error('Assignment failed:', err.response?.data || err);
      alert(`Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const finalDecision = async (claimId, finalStatus, finalAmount = 0) => {
  try {
    await axios.post(`${API_BASE_URL}/admin/claims/${claimId}/final-decision`, {
      finalStatus,
      finalApprovedAmount: parseFloat(finalAmount)
    });

    // Update local state immediately
    setClaims(prevClaims =>
      prevClaims.map(c =>
        c.id === claimId
          ? { 
              ...c, 
              status: finalStatus,
              finalApprovedAmount: parseFloat(finalAmount)
            }
          : c
      )
    );

    alert(`Claim has been ${finalStatus === 'APPROVED' ? 'approved' : 'rejected'} successfully!`);
  } catch (err) {
    console.error('Final decision failed:', err.response || err);
    alert(`Failed: ${err.response?.data || err.message}`);
  }
};

  const handleDeleteClaim = async (claimId, claimName) => {
  if (window.confirm(`Permanently delete claim "${claimName}" (ID: ${claimId})? This cannot be undone.`)) {
    try {
      await axios.delete(`${API_BASE_URL}/admin/claims/${claimId}`);
      alert('Claim deleted successfully');
      fetchClaims(); // Refresh list
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete claim');
    }
  }
};
  const getStatusColor = (status) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
      SURVEY_COMPLETED: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = filterStatus === 'ALL' || claim.status === filterStatus;
    const matchesSearch = !searchQuery || 
      `${claim.user?.firstName || ''} ${claim.user?.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (claim.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (claim.policy?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (claim.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'PENDING').length,
    inReview: claims.filter(c => c.status === 'IN_REVIEW').length,
    surveyCompleted: claims.filter(c => c.status === 'SURVEY_COMPLETED').length,
    approved: claims.filter(c => c.status === 'APPROVED').length,
    rejected: claims.filter(c => c.status === 'REJECTED').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className=" py-16 px-16 mt-2">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-gray-600 mt-2">Assign surveyors and make final decisions on claims</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-10">
          <StatCard title="Total Claims" value={stats.total} color="gray" />
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="In Review" value={stats.inReview} color="blue" />
          <StatCard title="Survey Done" value={stats.surveyCompleted} color="purple" />
          <StatCard title="Approved" value={stats.approved} color="green" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by user, email, policy, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="SURVEY_COMPLETED">Survey Completed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button onClick={fetchClaims} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-6 text-gray-500 text-lg">Loading claims...</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <div className="text-6xl mb-6">📄</div>
              <h3 className="text-xl font-semibold mb-3">No claims found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Claim Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer & Policy</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Claimed Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-16 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-2">{claim.description}</p>
                        {claim.damagePhotoPath && (
                          <button
                            onClick={() => window.open(`${API_BASE_URL}${claim.damagePhotoPath}`, '_blank')}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            🖼️ View Photo
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{claim.user?.firstName} {claim.user?.lastName}</div>
                          <div className="text-sm text-gray-500">{claim.user?.email}</div>
                          <div className="text-sm font-medium text-blue-600 mt-1">{claim.policy?.name}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(claim.submissionDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xl font-bold text-green-600">
                          ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {claim.claimedCoverages?.length || 0} coverage(s)
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(claim.status)}`}>
                          {claim.status.replace('_', ' ')}
                        </span>
                        {claim.assignedSurveyor && (
                          <p className="text-xs text-gray-600 mt-2">
                            Surveyor: <strong>{claim.assignedSurveyor.firstName} {claim.assignedSurveyor.lastName}</strong>
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {/* Assign Surveyor - Only for PENDING */}
                        {claim.status === 'PENDING' && (
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                assignToSurveyor(claim.id, e.target.value);
                              }
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="" disabled>Select Surveyor</option>
                            {surveyors.length === 0 ? (
                              <option disabled>No surveyors available</option>
                            ) : (
                              surveyors.map((surveyor) => (
                                <option key={surveyor.id} value={surveyor.id}>
                                  {surveyor.firstName} {surveyor.lastName} ({surveyor.email})
                                </option>
                              ))
                            )}
                          </select>
                        )}

                        {/* Survey Completed - Show Report & Final Decision */}
                        {claim.status === 'SURVEY_COMPLETED' && (
                          <div className="space-y-3">
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                              <p className="font-medium text-purple-900">Survey Report:</p>
                              <p className="text-purple-800">{claim.surveyReport || 'No report'}</p>
                              <div className="mt-2 flex justify-between">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  claim.recommendation === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {claim.recommendation === 'APPROVED' ? 'Recommended Approval' : 'Recommended Rejection'}
                                </span>
                                <span className="font-bold text-purple-900">₹{claim.recommendedAmount || 0}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => finalDecision(claim.id, 'APPROVED', claim.recommendedAmount || 0)}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => finalDecision(claim.id, 'REJECTED', 0)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Final Status */}
                        {(claim.status === 'APPROVED' || claim.status === 'REJECTED') && (
                          <div className="text-center">
                            <span className={`px-5 py-2 rounded-full font-bold text-sm border ${
                              claim.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                              {claim.status}
                            </span>
                            {claim.finalApprovedAmount > 0 && (
                              <p className="text-xl font-bold text-emerald-600 mt-2">₹{claim.finalApprovedAmount}</p>
                            )}
                            
                          </div>
                          
                        )}
                        

                        {claim.status === 'IN_REVIEW' && (
                          <span className="text-sm text-blue-600 italic">Awaiting surveyor report...</span>
                        )}
                      </td>
                       <td className="px-6 py-4 text-sm text-gray-900">
                        {/* Delete Claim Button - Always Available */}
                            <div className="mt-4">
                              
                              <button
                                onClick={() => handleDeleteClaim(claim.id, claim.policy?.name || 'Claim')}
                                className=" px-8 py-2.5 bg-red-500 text-white rounded-lg  font-medium text-sm transition-colors"
                              >
                                Delete Claim
                              </button>
                            </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    gray: 'bg-blue-100 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-100 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-100 border-blue-200 text-blue-700',
    purple: 'bg-purple-100 border-purple-200 text-purple-700',
    green: 'bg-green-100 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} shadow-sm`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-2">{title}</div>
    </div>
  );
}