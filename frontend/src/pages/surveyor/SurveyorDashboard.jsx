// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { 
//   DocumentTextIcon, 
//   PhotoIcon, 
//   CheckCircleIcon, 
//   XCircleIcon, 
//   ArrowUpTrayIcon, 
//   XMarkIcon,
//   ClockIcon,
//   ShieldCheckIcon,
//   UserCircleIcon
// } from '@heroicons/react/24/outline';
// import SurveyorNavbar from '../../components/SurveyorNavbar';

// export default function SurveyorDashboard() {
//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const [assignedClaims, setAssignedClaims] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('assigned');
//   const [selectedClaim, setSelectedClaim] = useState(null);
//   const [showReviewForm, setShowReviewForm] = useState(false);

//   // Review form state
//   const [reviewData, setReviewData] = useState({
//     recommendedAmount: '',
//     surveyReport: '',
//     surveyPhotos: [],
//     recommendation: 'APPROVED' // This will be sent as recommendation
//   });
  

//   useEffect(() => {
//     if (user && user.id) {
//       fetchAssignedClaims();
//     }
//   }, []);

//   const fetchAssignedClaims = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8080/api/claims/surveyor/${user.id}`);
//       setAssignedClaims(res.data);
//     } catch (err) {
//       console.error('Failed to fetch assigned claims:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 5) {
//       alert('Maximum 5 photos allowed');
//       return;
//     }
//     setReviewData({ ...reviewData, surveyPhotos: files });
//   };

//   const submitReview = async (e) => {
//     e.preventDefault();

//     if (!reviewData.recommendedAmount || !reviewData.surveyReport) {
//       alert('Please fill recommended amount and survey report');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('recommendedAmount', reviewData.recommendedAmount);
//     formData.append('surveyReport', reviewData.surveyReport);
//     formData.append('recommendation', reviewData.recommendation); // APPROVED or REJECTED
//     reviewData.surveyPhotos.forEach((photo) => {
//       formData.append('surveyPhotos', photo);
//     });

//     try {
//       await axios.post(`http://localhost:8080/api/claims/${selectedClaim.id}/survey-report`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       alert(`Claim review submitted — Recommended: ${reviewData.recommendation}`);

//       // Update local state
//       setAssignedClaims(assignedClaims.map(c => 
//         c.id === selectedClaim.id 
//           ? { 
//               ...c, 
//               status: 'SURVEY_COMPLETED',
//               recommendation: reviewData.recommendation,
//               recommendedAmount: parseFloat(reviewData.recommendedAmount),
//               surveyReport: reviewData.surveyReport
//             } 
//           : c
//       ));

//       setShowReviewForm(false);
//       setReviewData({ recommendedAmount: '', surveyReport: '', surveyPhotos: [], recommendation: 'APPROVED' });

//     } catch (err) {
//       console.error('Failed to submit review:', err);
//       alert('Failed to submit review: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   if (!user || user.role !== 'SURVEYOR') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
//             <XCircleIcon className="w-12 h-12 text-red-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
//           <p className="text-gray-600 mb-6">Only surveyors can access this page.</p>
//           <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
//             Go to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const stats = {
//     totalAssigned: assignedClaims.length,
//     pendingReview: assignedClaims.filter(c => c.status === 'IN_REVIEW').length,
//     completed: assignedClaims.filter(c => c.status === 'SURVEY_COMPLETED').length
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SurveyorNavbar />

//       <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-16 my-4">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Welcome, {user.firstName}!
//             </h1>
//             <p className="text-gray-600">Review and assess assigned insurance claims</p>
//           </div>
//           <div className="mt-4 lg:mt-0 text-right">
//             <p className="text-2xl font-bold text-gray-900">{stats.totalAssigned}</p>
//             <p className="text-sm text-gray-600">Claims Assigned</p>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <StatCard title="Total Assigned" value={stats.totalAssigned} color="blue" icon={<DocumentTextIcon className="w-6 h-6" />} />
//           <StatCard title="Pending Review" value={stats.pendingReview} color="yellow" icon={<ClockIcon className="w-6 h-6" />} />
//           <StatCard title="Completed" value={stats.completed} color="green" icon={<CheckCircleIcon className="w-6 h-6" />} />
//         </div>

//         {/* Tabs */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               <TabButton active={activeTab === 'assigned'} onClick={() => setActiveTab('assigned')}>
//                 Assigned ({stats.pendingReview})
//               </TabButton>
//               <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
//                 Completed ({stats.completed})
//               </TabButton>
//             </nav>
//           </div>
//         </div>

//         {/* Assigned Claims */}
//         {activeTab === 'assigned' && (
//           <div className="space-y-6">
//             {assignedClaims.filter(c => c.status === 'IN_REVIEW').length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
//                 <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//                 <p className="text-gray-600">No pending claims to review</p>
//               </div>
//             ) : (
//               assignedClaims
//                 .filter(c => c.status === 'IN_REVIEW')
//                 .map(claim => (
//                   <div 
//                     key={claim.id} 
//                     className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
//                     onClick={() => {
//                       setSelectedClaim(claim);
//                       setShowReviewForm(true);
//                     }}
//                   >
//                     <div className="flex flex-col lg:flex-row justify-between gap-6">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-4 mb-3">
//                           <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
//                             <ShieldCheckIcon className="w-6 h-6 text-white" />
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-bold text-gray-900">{claim.policy?.name}</h3>
//                             <p className="text-sm text-gray-600">
//                               Customer: {claim.user?.firstName} {claim.user?.lastName}
//                             </p>
//                           </div>
//                         </div>
//                         <p className="text-gray-700 mt-3 line-clamp-2">{claim.description}</p>
//                         <div className="flex flex-wrap gap-2 mt-4">
//                           {claim.claimedCoverages?.slice(0, 3).map(cov => (
//                             <span key={cov.id} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
//                               {cov.type}
//                             </span>
//                           ))}
//                           {claim.claimedCoverages?.length > 3 && (
//                             <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                               +{claim.claimedCoverages.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-3xl font-bold text-gray-900">
//                           ₹{claim.claimedCoverages?.reduce((s, c) => s + parseFloat(c.amount || 0), 0) || 0}
//                         </div>
//                         <p className="text-sm text-gray-600">Total Claimed</p>
//                         <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
//                           Start Review →
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//             )}
//           </div>
//         )}

//         {/* Completed Tab */}
//         {activeTab === 'completed' && (
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-xl font-bold">Completed Reviews</h3>
//             </div>
//             {assignedClaims.filter(c => c.status === 'SURVEY_COMPLETED').length === 0 ? (
//               <div className="p-16 text-center text-gray-500">
//                 <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                 <p>No completed reviews yet</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-200">
//                 {assignedClaims
//                   .filter(c => c.status === 'SURVEY_COMPLETED')
//                   .map(claim => (
//                     <div key={claim.id} className="p-6">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-bold text-gray-900">{claim.policy?.name}</h4>
//                           <p className="text-sm text-gray-600">
//                             Claim #{claim.id} • {claim.user?.firstName} {claim.user?.lastName}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <span className={`px-4 py-2 rounded-full text-sm font-bold ${
//                             claim.recommendation === 'APPROVED' 
//                               ? 'bg-green-200 text-green-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                             {claim.recommendation === 'APPROVED' ? 'Recommended Approval' : 'Recommended Rejection'}
//                           </span>
//                           <p className="text-xl font-bold text-gray-900 mt-2">
//                             ₹{claim.recommendedAmount || 0}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Review Modal */}
//       {showReviewForm && selectedClaim && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Review Claim #{selectedClaim.id}</h2>
//                 <p className="text-gray-600 mt-1">
//                   {selectedClaim.policy?.name} • {selectedClaim.user?.firstName} {selectedClaim.user?.lastName}
//                 </p>
//               </div>
//               <button onClick={() => setShowReviewForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
//                 <XMarkIcon className="w-6 h-6 text-gray-600" />
//               </button>
//             </div>

//             <div className="p-8 space-y-8">
//               {/* Claim Details */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="font-bold text-gray-900 mb-3">Customer Damage Report</h3>
//                   <p className="text-gray-700 mb-4 leading-relaxed">{selectedClaim.description}</p>
//                   {selectedClaim.damagePhotoPath && (
//                     <img 
//                       src={`http://localhost:8080${selectedClaim.damagePhotoPath}`}
//                       alt="Damage"
//                       className="w-full rounded-2xl border border-gray-300 shadow-lg"
//                     />
//                   )}
//                 </div>

//                 <div>
//                   <h3 className="font-bold text-gray-900 mb-4">Claimed Coverages</h3>
//                   <div className="space-y-3">
//                     {selectedClaim.claimedCoverages?.map(cov => (
//                       <div key={cov.id} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
//                         <div className="flex justify-between">
//                           <div>
//                             <div className="font-semibold text-gray-900">{cov.type}</div>
//                             <div className="text-sm text-gray-600">{cov.description}</div>
//                           </div>
//                           <div className="text-2xl font-bold text-indigo-600">₹{cov.amount}</div>
//                         </div>
//                       </div>
//                     ))}
//                     <div className="pt-4 border-t-2 border-indigo-300">
//                       <div className="flex justify-between text-lg font-bold">
//                         <span>Total Claimed Amount</span>
//                         <span className="text-indigo-600">
//                           ₹{selectedClaim.claimedCoverages?.reduce((s, c) => s + parseFloat(c.amount || 0), 0) || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Survey Form */}
//               <form onSubmit={submitReview} className="space-y-6">
//                 <div>
//                   <label className="block font-semibold text-gray-900 mb-2">
//                     Your Recommendation <span className="text-red-500">*</span>
//                   </label>
//                   <div className="grid grid-cols-2 gap-4">
//                     <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-emerald-50 transition-all">
//                       <input
//                         type="radio"
//                         name="recommendation"
//                         value="APPROVED"
//                         checked={reviewData.recommendation === 'APPROVED'}
//                         onChange={(e) => setReviewData({ ...reviewData, recommendation: e.target.value })}
//                         className="mr-3"
//                         required
//                       />
//                       <span className="font-medium text-emerald-700">Approve Claim</span>
//                     </label>
//                     <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-red-50 transition-all">
//                       <input
//                         type="radio"
//                         name="recommendation"
//                         value="REJECTED"
//                         checked={reviewData.recommendation === 'REJECTED'}
//                         onChange={(e) => setReviewData({ ...reviewData, recommendation: e.target.value })}
//                         className="mr-3"
//                       />
//                       <span className="font-medium text-red-700">Reject Claim</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-900 mb-2">
//                     Recommended Amount (₹) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={reviewData.recommendedAmount}
//                     onChange={(e) => setReviewData({ ...reviewData, recommendedAmount: e.target.value })}
//                     className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="e.g. 45000"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-900 mb-2">
//                     Survey Report <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     rows="8"
//                     value={reviewData.surveyReport}
//                     onChange={(e) => setReviewData({ ...reviewData, surveyReport: e.target.value })}
//                     className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                     placeholder="Write your detailed findings, damage assessment, verification notes, and justification for recommendation..."
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-900 mb-2">
//                     Upload Survey Photos (Optional - Max 5)
//                   </label>
//                   <div className="border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-400 transition-all">
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="hidden"
//                       id="survey-photos-upload"
//                     />
//                     <label htmlFor="survey-photos-upload" className="cursor-pointer">
//                       <ArrowUpTrayIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <p className="text-lg font-medium text-gray-700">Click to upload photos</p>
//                       <p className="text-sm text-gray-500 mt-2">JPG, PNG • Max 5 photos • 5MB each</p>
//                     </label>
//                     {reviewData.surveyPhotos.length > 0 && (
//                       <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {reviewData.surveyPhotos.map((file, i) => (
//                           <div key={i} className="relative group">
//                             <img 
//                               src={URL.createObjectURL(file)} 
//                               alt="preview" 
//                               className="w-full h-32 object-cover rounded-lg border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => setReviewData({
//                                 ...reviewData,
//                                 surveyPhotos: reviewData.surveyPhotos.filter((_, idx) => idx !== i)
//                               })}
//                               className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
//                             >
//                               <XMarkIcon className="w-4 h-4" />
//                             </button>
//                             <p className="text-xs text-center mt-1 truncate">{file.name}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowReviewForm(false)}
//                     className="flex-1 py-4 px-8 bg-red-600  text-white-800 font-bold rounded-xl transition-all"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 py-4 px-8 bg-gradient-to-r from-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition-all"
//                   >
//                     Submit Survey Report
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Helper Components
// function TabButton({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`py-4 px-6 text-lg font-medium transition-all border-b-4 ${
//         active
//           ? 'border-emerald-500 text-emerald-600'
//           : 'border-transparent text-gray-600 hover:text-gray-900'
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function StatCard({ title, value, color, icon }) {
//   const bgColors = {
//     blue: 'from-blue-500 to-indigo-600',
//     yellow: 'from-yellow-400 to-orange-500',
//     green: 'from-green-500 to-teal-600'
//   };

//   return (
//     <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`w-16 h-16 bg-gradient-to-r ${bgColors[color]} rounded-2xl flex items-center justify-center text-white`}>
//           {icon}
//         </div>
//         <p className="text-4xl font-bold text-gray-900">{value}</p>
//       </div>
//       <p className="text-lg font-medium text-gray-700">{title}</p>
//     </div>
//   );
// }

// src/pages/surveyor/SurveyorDashboard.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // ← Add useNavigate
import SurveyorNavbar from '../../components/SurveyorNavbar';
import { 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function SurveyorDashboard() {
  const navigate = useNavigate(); // ← Add this
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [assignedClaims, setAssignedClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');

  useEffect(() => {
    if (user && user.id) {
      fetchAssignedClaims();
    }
  }, []);

  const fetchAssignedClaims = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/claims/surveyor/${user.id}`);
      setAssignedClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch assigned claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalAssigned: assignedClaims.length,
    pendingReview: assignedClaims.filter(c => c.status === 'IN_REVIEW').length,
    completed: assignedClaims.filter(c => c.status === 'SURVEY_COMPLETED').length
  };

  if (!user || user.role !== 'SURVEYOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-6">Only surveyors can access this page.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyorNavbar />

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-16 my-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user.firstName}!
            </h1>
            <p className="text-gray-600">Review and assess assigned insurance claims</p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <p className="text-2xl font-bold text-gray-900">{stats.totalAssigned}</p>
            <p className="text-sm text-gray-600">Claims Assigned</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Assigned" value={stats.totalAssigned} color="blue" icon={<DocumentTextIcon className="w-6 h-6" />} />
          <StatCard title="Pending Review" value={stats.pendingReview} color="yellow" icon={<ClockIcon className="w-6 h-6" />} />
          <StatCard title="Completed" value={stats.completed} color="green" icon={<CheckCircleIcon className="w-6 h-6" />} />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <TabButton active={activeTab === 'assigned'} onClick={() => setActiveTab('assigned')}>
                Assigned ({stats.pendingReview})
              </TabButton>
              <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                Completed ({stats.completed})
              </TabButton>
            </nav>
          </div>
        </div>

        {/* Assigned Claims */}
        {activeTab === 'assigned' && (
          <div className="space-y-6">
            {assignedClaims.filter(c => c.status === 'IN_REVIEW').length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No pending claims to review</p>
              </div>
            ) : (
              assignedClaims
                .filter(c => c.status === 'IN_REVIEW')
                .map(claim => (
                  <div 
                    key={claim.id} 
                    className="max-w-5xl px-16 py-16 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow inline-block mx-8"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <ShieldCheckIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{claim.policy?.name}</h3>
                            <p className="text-sm text-gray-600">
                              Customer: {claim.user?.firstName} {claim.user?.lastName}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-3 line-clamp-2">{claim.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {claim.claimedCoverages?.slice(0, 3).map(cov => (
                            <span key={cov.id} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                              {cov.type}
                            </span>
                          ))}
                          {claim.claimedCoverages?.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{claim.claimedCoverages.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                          ₹{claim.claimedCoverages?.reduce((s, c) => s + parseFloat(c.amount || 0), 0) || 0}
                        </div>
                        <p className="text-sm text-gray-600">Total Claimed</p>
                        <button 
                            onClick={() => navigate('/surveyor/review-claim', { state: { claim } })}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                          >
                            Start Review →
                          </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Completed Tab */}
        {activeTab === 'completed' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold">Completed Reviews</h3>
            </div>
            {assignedClaims.filter(c => c.status === 'SURVEY_COMPLETED').length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>No completed reviews yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {assignedClaims
                  .filter(c => c.status === 'SURVEY_COMPLETED')
                  .map(claim => (
                    <div key={claim.id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">{claim.policy?.name}</h4>
                          <p className="text-sm text-gray-600">
                            Claim #{claim.id} • {claim.user?.firstName} {claim.user?.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            claim.recommendation === 'APPROVED' 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {claim.recommendation === 'APPROVED' ? 'Recommended Approval' : 'Recommended Rejection'}
                          </span>
                          <p className="text-xl font-bold text-gray-900 mt-2">
                            ₹{claim.recommendedAmount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Keep your TabButton and StatCard components unchanged
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-6 text-lg font-medium transition-all border-b-4 ${
        active
          ? 'border-emerald-500 text-emerald-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, color, icon }) {
  const bgColors = {
    blue: 'from-blue-500 to-indigo-600',
    yellow: 'from-yellow-400 to-orange-500',
    green: 'from-green-500 to-teal-600'
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-16 h-16 bg-gradient-to-r ${bgColors[color]} rounded-2xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      </div>
      <p className="text-lg font-medium text-gray-700">{title}</p>
    </div>
  );
}
