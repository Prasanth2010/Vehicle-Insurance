import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClaims();
    fetchSurveyors();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/claims');
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyors = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/surveyors');
      setSurveyors(res.data);
    } catch (err) {
      console.error('Failed to fetch surveyors:', err);
      setSurveyors([]);
    }
  };

  const assignToSurveyor = async (claimId, surveyorId) => {
    if (!surveyorId) return;
    try {
      await axios.post(`http://localhost:8080/admin/claims/${claimId}/assign`, {
        surveyorId: parseInt(surveyorId)
      });

      const assignedSurveyor = surveyors.find(s => s.id === parseInt(surveyorId));
      setClaims(claims.map(c =>
        c.id === claimId ? { ...c, status: 'IN_REVIEW', assignedSurveyor } : c
      ));
      alert('Claim assigned successfully!');
    } catch (err) {
      alert('Failed to assign');
    }
  };

  const finalDecision = async (claimId, finalStatus, amount) => {
    try {
      await axios.post(`http://localhost:8080/admin/claims/${claimId}/final-decision`, {
        finalStatus,
        finalApprovedAmount: parseFloat(amount || 0)
      });

      setClaims(claims.map(c =>
        c.id === claimId
          ? { ...c, status: finalStatus, finalApprovedAmount: parseFloat(amount || 0) }
          : c
      ));
      alert(`Claim ${finalStatus.toLowerCase()}!`);
    } catch (err) {
      alert('Failed to process decision');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
      SURVEY_COMPLETED: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = filterStatus === 'ALL' || claim.status === filterStatus;
    const matchesSearch = !searchQuery ||
      `${claim.user?.firstName} ${claim.user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.policy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'PENDING').length,
    inReview: claims.filter(c => c.status === 'IN_REVIEW').length,
    surveyDone: claims.filter(c => c.status === 'SURVEY_COMPLETED').length,
    approved: claims.filter(c => c.status === 'APPROVED').length,
    rejected: claims.filter(c => c.status === 'REJECTED').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-16 px-8 mt-2">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-gray-600 mt-2">Assign surveyors and make final decisions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-10">
          <StatCard title="Total" value={stats.total} color="gray" />
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="In Review" value={stats.inReview} color="blue" />
          <StatCard title="Survey Done" value={stats.surveyDone} color="purple" />
          <StatCard title="Approved" value={stats.approved} color="emerald" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 pl-10 pr-4 py-3 border rounded-lg"
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-5 py-3 border rounded-lg">
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="SURVEY_COMPLETED">Survey Completed</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button onClick={fetchClaims} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">Loading...</div>
          ) : filteredClaims.length === 0 ? (
            <div className="p-16 text-center text-gray-500">No claims found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Claim Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer & Policy</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Claimed Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-2">{claim.description}</p>
                      {claim.damagePhotoPath && (
                        <button onClick={() => window.open(`http://localhost:8080${claim.damagePhotoPath}`, '_blank')}
                          className="text-xs text-blue-600">View Photo</button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{claim.user?.firstName} {claim.user?.lastName}</div>
                      <div className="text-sm text-gray-500">{claim.user?.email}</div>
                      <div className="text-sm text-blue-600 mt-1">{claim.policy?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      ₹{claim.claimedCoverages?.reduce((s, c) => s + parseFloat(c.amount || 0), 0) || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(claim.status)}`}>
                        {claim.status.replace('_', ' ')}
                      </span>
                      {claim.assignedSurveyor && (
                        <div className="text-xs mt-1">
                          Surveyor: {claim.assignedSurveyor.firstName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* Assign Surveyor */}
                      {claim.status === 'PENDING' && (
                        <select
                          onChange={(e) => e.target.value && assignToSurveyor(claim.id, e.target.value)}
                          defaultValue=""
                          className="px-4 py-2 border rounded-lg text-sm"
                        >
                          <option value="" disabled>Assign Surveyor</option>
                          {surveyors.map(s => (
                            <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                          ))}
                        </select>
                      )}

                      {/* Survey Completed - Admin Final Decision */}
                      {claim.status === 'SURVEY_COMPLETED' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <p className="font-semibold text-indigo-900">Surveyor Report:</p>
                            <p className="text-sm text-indigo-800 mt-1">{claim.surveyReport || 'No report'}</p>
                            <div className="mt-3 flex justify-between">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                claim.surveyStatus === 'SURVEYOR_APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {claim.surveyStatus === 'SURVEYOR_APPROVED' ? 'Recommended Approve' : 'Recommended Reject'}
                              </span>
                              <span className="font-bold text-indigo-900">₹{claim.recommendedAmount || 0}</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => finalDecision(claim.id, 'APPROVED', claim.recommendedAmount)}
                              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
                              Approve
                            </button>
                            <button onClick={() => finalDecision(claim.id, 'REJECTED', 0)}
                              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Final Status */}
                      {(claim.status === 'APPROVED' || claim.status === 'REJECTED') && (
                        <div className="text-center">
                          <span className={`px-5 py-2 rounded-full font-bold text-sm border ${
                            claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {claim.status}
                          </span>
                          {claim.finalApprovedAmount > 0 && (
                            <p className="text-xl font-bold text-emerald-600 mt-2">₹{claim.finalApprovedAmount}</p>
                          )}
                        </div>
                      )}

                      {claim.status === 'IN_REVIEW' && <span className="text-gray-500">Waiting for surveyor...</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700'
  };
  return (
    <div className={`p-6 rounded-xl border ${colors[color]} shadow-sm`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-2">{title}</div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../../components/AdminNavbar';

// export default function AdminClaims() {
//   const [claims, setClaims] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchClaims();
//   }, []);

//   const fetchClaims = async () => {
//     try {
//       const res = await axios.get('http://localhost:8080/admin/claims');
//       setClaims(res.data);
//     } catch (err) {
//       console.error('Failed to fetch claims:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.put(`http://localhost:8080/admin/claims/${id}/status`, { status });
//       setClaims(claims.map(c => c.id === id ? { ...c, status } : c));
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'APPROVED': return 'bg-emerald-100 text-emerald-800';
//       case 'REJECTED': return 'bg-red-100 text-red-800';
//       default: return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminNavbar />
      
//       <div className="container-padding py-12">
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims Management</h1>
//           <p className="text-gray-600">
//             Review and manage all insurance claims submitted by customers
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <StatCard 
//             title="Total Claims" 
//             value={claims.length} 
//             color="blue"
//           />
//           <StatCard 
//             title="Pending" 
//             value={claims.filter(c => c.status === 'PENDING').length} 
//             color="yellow"
//           />
//           <StatCard 
//             title="Approved" 
//             value={claims.filter(c => c.status === 'APPROVED').length} 
//             color="emerald"
//           />
//           <StatCard 
//             title="Rejected" 
//             value={claims.filter(c => c.status === 'REJECTED').length} 
//             color="red"
//           />
//         </div>

//         {/* Claims List */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {loading ? (
//             <div className="p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-4 text-gray-500">Loading claims...</p>
//             </div>
//           ) : claims.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="text-gray-400 text-4xl mb-4">📄</div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
//               <p className="text-gray-500">No claims have been submitted yet.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Claim Details
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Policy
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {claims.map((claim) => (
//                     <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 font-medium mb-1">
//                           {claim.description?.substring(0, 60)}...
//                         </div>
//                         {claim.damagePhotoPath && (
//                           <button 
//                             className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                             onClick={() => window.open(`http://localhost:8080${claim.damagePhotoPath}`, '_blank')}
//                           >
//                             View Damage Photos →
//                           </button>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{claim.policy?.name}</div>
//                         <div className="text-xs text-gray-500">{claim.policy?.plan}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center mr-3">
//                             <span className="text-white text-xs font-semibold">
//                               {claim.user?.firstName?.charAt(0)}
//                             </span>
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {claim.user?.firstName} {claim.user?.lastName}
//                             </div>
//                             <div className="text-xs text-gray-500">{claim.user?.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
//                           {claim.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={claim.status}
//                           onChange={(e) => updateStatus(claim.id, e.target.value)}
//                           className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
//                                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                         >
//                           <option value="PENDING">Pending</option>
//                           <option value="APPROVED">Approve</option>
//                           <option value="REJECTED">Reject</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, color }) {
//   const colorClasses = {
//     blue: 'bg-blue-50 border-blue-200 text-blue-700',
//     yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
//     emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
//     red: 'bg-red-50 border-red-200 text-red-700'
//   };

//   return (
//     <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
//       <div className="text-2xl font-bold">{value}</div>
//       <div className="text-sm font-medium mt-1">{title}</div>
//     </div>
//   );
// }