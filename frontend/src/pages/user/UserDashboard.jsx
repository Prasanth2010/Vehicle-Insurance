import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useLocation } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const policiesRes = await axios.get(`${API_BASE_URL}/api/policies`);
      setPolicies(policiesRes.data || []);

      try {
        const claimsRes = await axios.get(`${API_BASE_URL}/api/claims/my?userId=${user.id}`);
        setClaims(claimsRes.data || []);
      } catch (claimsErr) {
        console.warn('Claims fetch failed:', claimsErr);
        setClaims([]);
      }
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      setPolicies([]);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };
const location = useLocation();

useEffect(() => {
  if (location.state?.activeTab === 'profile') {
    setActiveTab('profile');
  }
}, [location.state]);


   if (!user.id || user.role !== 'USER') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
            <p className="text-gray-600 mb-6">Customer credentials required to access this panel.</p>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Go to Customer Login
            </Link>
          </div>
        </div>
      );
    }

  const userStats = {
    totalPolicies: policies.length,
    processingClaims: claims.filter(c => ['PENDING', 'IN_REVIEW', 'SURVEY_COMPLETED'].includes(c.status)).length,
    approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
    rejectedClaims: claims.filter(c => c.status === 'REJECTED').length
  };

  const getStatusInfo = (claim) => {
    switch (claim.status) {
      case 'APPROVED':
        return { text: `Approved — ₹${claim.finalApprovedAmount || 0} Paid`, color: 'bg-green-100 text-green-800' };
      case 'REJECTED':
        return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
      case 'SURVEY_COMPLETED':
        return { text: 'Survey Completed — Awaiting Final Decision', color: 'bg-purple-100 text-purple-800' };
      case 'IN_REVIEW':
        return { text: 'Under Survey Review', color: 'bg-blue-100 text-blue-800' };
      case 'PENDING':
        return { text: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { text: 'Unknown Status', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600">Track your insurance claims and policies</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/user/new-claim')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Submit New Claim
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
              <button onClick={fetchDashboardData} className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium">
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Policies" value={userStats.totalPolicies} color="blue" icon={<DocumentTextIcon className="w-6 h-6" />} />
          <StatCard title="Processing" value={userStats.processingClaims} color="yellow" icon={<ClockIcon className="w-6 h-6" />} />
          <StatCard title="Approved" value={userStats.approvedClaims} color="green" icon={<CheckCircleIcon className="w-6 h-6" />} />
          <StatCard title="Rejected" value={userStats.rejectedClaims} color="red" icon={<XCircleIcon className="w-6 h-6" />} />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
              <TabButton active={activeTab === 'policies'} onClick={() => setActiveTab('policies')}>My Policies</TabButton>
              <TabButton active={activeTab === 'claims'} onClick={() => setActiveTab('claims')}>Claim History</TabButton>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Recent Claims */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Recent Claims</h2>
                      <p className="text-gray-600 mt-1">Your latest claim activity</p>
                    </div>
                    <button onClick={() => setActiveTab('claims')} className="text-blue-600 hover:text-blue-800 font-medium">
                      View all →
                    </button>
                  </div>

                  {claims.length === 0 ? (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-6">No claims submitted yet</p>
                      <button 
                        onClick={() => navigate('/user/new-claim')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
                      >
                        Submit Your First Claim
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {[...claims]
                        .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
                        .slice(0, 3)
                        .map(claim => (
                          <ClaimItem key={claim.id} claim={claim} getStatusInfo={getStatusInfo} />
                        ))}
                    </div>
                  )}
                </div>

                {/* Available Policies */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Your Policies</h2>
                      <p className="text-gray-600 mt-1">Active insurance coverage</p>
                    </div>
                    <button onClick={() => setActiveTab('policies')} className="text-blue-600 hover:text-blue-800 font-medium">
                      View all →
                    </button>
                  </div>

                  {policies.length === 0 ? (
                    <div className="text-center py-12">
                      <ShieldCheckIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No active policies found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {policies.slice(0, 3).map(policy => (
                        <PolicyItem key={policy.id} policy={policy} navigate={navigate} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">My Policies</h2>
                  <p className="text-gray-600 mt-2">{policies.length} active policies</p>
                </div>
                {policies.length === 0 ? (
                  <div className="p-20 text-center text-gray-500">
                    <ShieldCheckIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                    <p className="text-xl">No policies available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {policies.map(policy => (
                      <div key={policy.id} className="p-8 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="flex-1">
                            <div className="flex items-start gap-6">
                              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900">{policy.name}</h3>
                                <p className="text-gray-600 mt-2">{policy.description}</p>
                                <div className="flex items-center gap-6 mt-6">
                                  <span className="px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                                    {policy.plan}
                                  </span>
                                  <span className="text-3xl font-bold text-gray-900">₹{policy.premiumAmount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate('/user/new-claim', { state: { policy } })}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                          >
                            File Claim →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Claims Tab */}
            {activeTab === 'claims' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Claim History</h2>
                  <p className="text-gray-600 mt-2">{claims.length} total claims</p>
                </div>
                {claims.length === 0 ? (
                  <div className="p-20 text-center text-gray-500">
                    <DocumentTextIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-xl font-bold mb-4">No Claims Yet</h3>
                    <p className="mb-8">Start by submitting your first claim</p>
                    <button 
                      onClick={() => navigate('/user/new-claim')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg"
                    >
                      Submit New Claim
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {[...claims]
                      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
                      .map(claim => {
                        const statusInfo = getStatusInfo(claim);
                        return (
                          <div key={claim.id} className="p-8 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                              <div className="flex-1">
                                <div className="flex items-center gap-6 mb-4">
                                  <h3 className="text-2xl font-bold text-gray-900">{claim.policy?.name}</h3>
                                  <span className={`px-6 py-3 rounded-full text-base font-bold ${statusInfo.color}`}>
                                    {statusInfo.text}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-4">
                                  Submitted on {new Date(claim.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-gray-700 leading-relaxed">{claim.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500 mb-2">Claim ID #{claim.id}</p>
                                <p className="text-3xl font-bold text-gray-900">
                                  ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
                                </p>
                                <p className="text-gray-600">Total Claimed</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// === Helper Components (Now defined inside the file) ===

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-8 text-lg font-medium transition-all border-b-4 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, color, icon }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className={`p-8 rounded-3xl shadow-xl border-2 ${colors[color]} bg-white`}>
      <div className="flex items-center justify-between mb-6">
        <div className="p-4 bg-white rounded-2xl shadow-md">
          {icon}
        </div>
        <p className="text-5xl font-bold">{value}</p>
      </div>
      <p className="text-xl font-semibold">{title}</p>
    </div>
  );
}

function ClaimItem({ claim, getStatusInfo }) {
  const statusInfo = getStatusInfo(claim);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-300 hover:shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-6 mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{claim.policy?.name || 'Unknown Policy'}</h3>
            <span className={`px-6 py-3 rounded-full text-base font-bold ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">{claim.description}</p>
          <p className="text-sm text-gray-500">
            Submitted: {new Date(claim.submissionDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-gray-900">
            ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
          </p>
          <p className="text-gray-600">Claimed Amount</p>
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ policy, navigate }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{policy.name}</h3>
          <p className="text-gray-600 mt-3 max-w-md">{policy.description}</p>
        </div>
        <span className="px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full font-bold">
          {policy.plan}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-4xl font-bold text-gray-900">₹{policy.premiumAmount}</div>
        <button 
          onClick={() => navigate('/user/new-claim', { state: { policy } })}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          File Claim →
        </button>
      </div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../../components/Navbar';
// import { useLocation } from 'react-router-dom';
// import { 
//   DocumentTextIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ExclamationTriangleIcon,
//   UserCircleIcon,
//   ShieldCheckIcon,
//   MagnifyingGlassIcon,
//   ChevronRightIcon,
//   PlusCircleIcon,
//   ArrowTrendingUpIcon,
//   ClipboardDocumentListIcon,
//   BuildingLibraryIcon,
//   CurrencyDollarIcon,
//   CalendarDaysIcon,
//   UserGroupIcon,
//   AdjustmentsHorizontalIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/outline';

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const [claims, setClaims] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [error, setError] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     if (user && user.id) {
//       fetchDashboardData();
//     }
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const policiesRes = await axios.get('${API_BASE_URL}/api/policies');
//       setPolicies(policiesRes.data || []);

//       try {
//         const claimsRes = await axios.get(`${API_BASE_URL}/api/claims/my?userId=${user.id}`);
//         setClaims(claimsRes.data || []);
//       } catch (claimsErr) {
//         console.warn('Claims fetch failed:', claimsErr);
//         setClaims([]);
//       }
//     } catch (err) {
//       setError('Failed to load dashboard data. Please try again later.');
//       setPolicies([]);
//       setClaims([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const location = useLocation();

//   useEffect(() => {
//     if (location.state?.activeTab === 'profile') {
//       setActiveTab('profile');
//     }
//   }, [location.state]);

//   if (!user.id || user.role !== 'USER') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 mx-auto mb-6 bg-red-900/30 rounded-full flex items-center justify-center">
//             <XCircleIcon className="w-12 h-12 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
//           <p className="text-gray-300 mb-6">Customer credentials required to access this panel.</p>
//           <Link 
//             to="/login"
//             className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
//           >
//             Go to Customer Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const userStats = {
//     totalPolicies: policies.length,
//     processingClaims: claims.filter(c => ['PENDING', 'IN_REVIEW', 'SURVEY_COMPLETED'].includes(c.status)).length,
//     approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
//     rejectedClaims: claims.filter(c => c.status === 'REJECTED').length
//   };

//   const getStatusInfo = (claim) => {
//     switch (claim.status) {
//       case 'APPROVED':
//         return { text: `Approved`, color: 'bg-green-900/30 text-green-400', border: 'border-green-800/50', icon: <CheckCircleIcon className="w-5 h-5" /> };
//       case 'REJECTED':
//         return { text: 'Rejected', color: 'bg-red-900/30 text-red-400', border: 'border-red-800/50', icon: <XCircleIcon className="w-5 h-5" /> };
//       case 'SURVEY_COMPLETED':
//         return { text: 'Survey Done', color: 'bg-purple-900/30 text-purple-400', border: 'border-purple-800/50', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> };
//       case 'IN_REVIEW':
//         return { text: 'In Review', color: 'bg-blue-900/30 text-blue-400', border: 'border-blue-800/50', icon: <ClockIcon className="w-5 h-5" /> };
//       case 'PENDING':
//         return { text: 'Pending', color: 'bg-yellow-900/30 text-yellow-400', border: 'border-yellow-800/50', icon: <ClockIcon className="w-5 h-5" /> };
//       default:
//         return { text: 'Unknown', color: 'bg-gray-800 text-gray-400', border: 'border-gray-700', icon: <ExclamationTriangleIcon className="w-5 h-5" /> };
//     }
//   };

//   // Filter claims based on search
//   const filteredClaims = claims.filter(claim => 
//     claim.policy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     claim.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     claim.id?.toString().includes(searchQuery)
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <Navbar />

//       <div className="mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-white">Insurance Dashboard</h1>
//               <p className="text-gray-400 mt-2">Track and manage your insurance policies & claims</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
//                 <input
//                   type="text"
//                   placeholder="Search claims, policies..."
//                   className="pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 w-full lg:w-64 text-white placeholder-gray-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <button
//                 onClick={() => navigate('/user/new-claim')}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
//               >
//                 <PlusCircleIcon className="w-5 h-5" />
//                 New Claim
//               </button>
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-700">
//                 {user.firstName?.charAt(0).toUpperCase()}
//               </div>
//             </div>
//           </div>

//           {/* Dashboard Navigation Tabs */}
//           <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl border border-gray-700 max-w-md">
//             <button
//               onClick={() => setActiveTab('overview')}
//               className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
//                 activeTab === 'overview'
//                   ? 'bg-blue-600 text-white shadow-sm'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700'
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <BuildingLibraryIcon className="w-4 h-4" />
//                 Overview
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('policies')}
//               className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
//                 activeTab === 'policies'
//                   ? 'bg-blue-600 text-white shadow-sm'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700'
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <ShieldCheckIcon className="w-4 h-4" />
//                 Policies
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('claims')}
//               className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
//                 activeTab === 'claims'
//                   ? 'bg-blue-600 text-white shadow-sm'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700'
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <DocumentTextIcon className="w-4 h-4" />
//                 Claims
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-lg">
//             <div className="flex items-center">
//               <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
//               <span className="text-red-300">{error}</span>
//               <button onClick={fetchDashboardData} className="ml-auto text-sm text-red-400 hover:text-red-300 font-medium">
//                 Retry
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading ? (
//           <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//             <p className="mt-4 text-gray-400">Loading dashboard...</p>
//           </div>
//         ) : (
//           <>
//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//               <div className="space-y-6">
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-blue-600/50 transition-colors">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-800/30">
//                         <DocumentTextIcon className="w-6 h-6 text-blue-400" />
//                       </div>
//                       <span className="text-2xl font-bold text-white">{userStats.totalPolicies}</span>
//                     </div>
//                     <p className="text-sm font-medium text-gray-300">Total Policies</p>
//                     <p className="text-xs text-gray-500 mt-1">Active insurance plans</p>
//                   </div>

//                   <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-yellow-600/50 transition-colors">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-2 bg-yellow-900/30 rounded-lg border border-yellow-800/30">
//                         <ClockIcon className="w-6 h-6 text-yellow-400" />
//                       </div>
//                       <span className="text-2xl font-bold text-white">{userStats.processingClaims}</span>
//                     </div>
//                     <p className="text-sm font-medium text-gray-300">In Progress</p>
//                     <p className="text-xs text-gray-500 mt-1">Claims being processed</p>
//                   </div>

//                   <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-green-600/50 transition-colors">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-2 bg-green-900/30 rounded-lg border border-green-800/30">
//                         <CheckCircleIcon className="w-6 h-6 text-green-400" />
//                       </div>
//                       <span className="text-2xl font-bold text-white">{userStats.approvedClaims}</span>
//                     </div>
//                     <p className="text-sm font-medium text-gray-300">Approved</p>
//                     <p className="text-xs text-gray-500 mt-1">Claims approved</p>
//                   </div>

//                   <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-red-600/50 transition-colors">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-2 bg-red-900/30 rounded-lg border border-red-800/30">
//                         <XCircleIcon className="w-6 h-6 text-red-400" />
//                       </div>
//                       <span className="text-2xl font-bold text-white">{userStats.rejectedClaims}</span>
//                     </div>
//                     <p className="text-sm font-medium text-gray-300">Rejected</p>
//                     <p className="text-xs text-gray-500 mt-1">Claims rejected</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Recent Claims */}
//                   <div className="bg-gray-800 rounded-xl border border-gray-700">
//                     <div className="p-5 border-b border-gray-700">
//                       <div className="flex items-center justify-between">
//                         <h2 className="text-lg font-semibold text-white">Recent Claims</h2>
//                         <button 
//                           onClick={() => setActiveTab('claims')}
//                           className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
//                         >
//                           View all <ChevronRightIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="p-5">
//                       {filteredClaims.length === 0 ? (
//                         <div className="text-center py-8">
//                           <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-600 mb-3" />
//                           <p className="text-gray-400 mb-4">No claims submitted yet</p>
//                           <button 
//                             onClick={() => navigate('/user/new-claim')}
//                             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//                           >
//                             Submit Your First Claim
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {[...filteredClaims]
//                             .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
//                             .slice(0, 5)
//                             .map(claim => {
//                               const statusInfo = getStatusInfo(claim);
//                               return (
//                                 <div key={claim.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700 hover:border-gray-600">
//                                   <div className="flex items-center gap-3">
//                                     <div className={`p-2 rounded-lg border ${statusInfo.border} ${statusInfo.color}`}>
//                                       {statusInfo.icon}
//                                     </div>
//                                     <div>
//                                       <p className="font-medium text-white">{claim.policy?.name || 'Unknown Policy'}</p>
//                                       <p className="text-sm text-gray-400">
//                                         ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <span className="text-sm text-gray-500">
//                                     {new Date(claim.submissionDate).toLocaleDateString()}
//                                   </span>
//                                 </div>
//                               );
//                             })}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Your Policies */}
//                   <div className="bg-gray-800 rounded-xl border border-gray-700">
//                     <div className="p-5 border-b border-gray-700">
//                       <div className="flex items-center justify-between">
//                         <h2 className="text-lg font-semibold text-white">Your Policies</h2>
//                         <button 
//                           onClick={() => setActiveTab('policies')}
//                           className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
//                         >
//                           View all <ChevronRightIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="p-5">
//                       {policies.length === 0 ? (
//                         <div className="text-center py-8">
//                           <ShieldCheckIcon className="w-12 h-12 mx-auto text-gray-600 mb-3" />
//                           <p className="text-gray-400">No active policies found</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {policies.slice(0, 5).map(policy => (
//                             <div key={policy.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700 hover:border-gray-600">
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-800/30">
//                                   <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
//                                 </div>
//                                 <div>
//                                   <p className="font-medium text-white">{policy.name}</p>
//                                   <p className="text-sm text-gray-400">{policy.plan}</p>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <p className="font-medium text-white">₹{policy.premiumAmount}</p>
//                                 <button 
//                                   onClick={() => navigate('/user/new-claim', { state: { policy } })}
//                                   className="text-sm text-blue-400 hover:text-blue-300 font-medium"
//                                 >
//                                   Claim →
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* AI Status & Trends Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* AI Status */}
//                   <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
//                     <h2 className="text-lg font-semibold text-white mb-4">Claim Status</h2>
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
//                         <div className="flex items-center gap-3">
//                           <CheckCircleIcon className="w-5 h-5 text-green-400" />
//                           <span className="text-gray-300">Completed</span>
//                         </div>
//                         <span className="text-white font-semibold">{userStats.approvedClaims}</span>
//                       </div>
//                       <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
//                         <div className="flex items-center gap-3">
//                           <ClockIcon className="w-5 h-5 text-yellow-400" />
//                           <span className="text-gray-300">Pending</span>
//                         </div>
//                         <span className="text-white font-semibold">{userStats.processingClaims}</span>
//                       </div>
//                       <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
//                         <div className="flex items-center gap-3">
//                           <XCircleIcon className="w-5 h-5 text-red-400" />
//                           <span className="text-gray-300">Rejected</span>
//                         </div>
//                         <span className="text-white font-semibold">{userStats.rejectedClaims}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Trends */}
//                   <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
//                     <h2 className="text-lg font-semibold text-white mb-4">Trends Found</h2>
//                     <div className="flex items-center gap-3 mb-4">
//                       <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400" />
//                       <p className="text-gray-400">Try adjusting your filters or add new services</p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-800/30">
//                         Auto Insurance
//                       </span>
//                       <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-800/30">
//                         Health Claims
//                       </span>
//                       <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800/30">
//                         Property Damage
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Policies Tab */}
//             {activeTab === 'policies' && (
//               <div className="bg-gray-800 rounded-xl border border-gray-700">
//                 <div className="p-5 border-b border-gray-700">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div>
//                       <h2 className="text-xl font-semibold text-white">My Policies</h2>
//                       <p className="text-sm text-gray-400">{policies.length} active policies</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="relative">
//                         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
//                         <input
//                           type="text"
//                           placeholder="Search policies..."
//                           className="pl-9 pr-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-white placeholder-gray-500"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                       </div>
//                       <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors">
//                         <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 {policies.length === 0 ? (
//                   <div className="p-12 text-center">
//                     <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
//                     <h3 className="text-lg font-semibold text-white mb-2">No Policies Available</h3>
//                     <p className="text-gray-400">You don't have any active policies yet.</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-700">
//                     {policies.map(policy => (
//                       <div key={policy.id} className="p-5 hover:bg-gray-700/30 transition-colors">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                           <div className="flex items-start gap-4">
//                             <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-800/30">
//                               <ShieldCheckIcon className="w-7 h-7 text-blue-400" />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold text-white text-lg">{policy.name}</h3>
//                               <div className="flex items-center gap-3 mt-2">
//                                 <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-full border border-blue-800/30">
//                                   {policy.plan}
//                                 </span>
//                                 <span className="text-sm text-gray-400">{policy.description}</span>
//                               </div>
//                               <div className="flex items-center gap-4 mt-3">
//                                 <div className="flex items-center gap-2">
//                                   <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
//                                   <span className="text-sm text-gray-300">₹{policy.premiumAmount}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
//                                   <span className="text-sm text-gray-300">Annual Premium</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-4">
//                             <div className="text-right">
//                               <p className="text-2xl font-bold text-white">₹{policy.premiumAmount}</p>
//                               <p className="text-sm text-gray-400">Premium</p>
//                             </div>
//                             <button 
//                               onClick={() => navigate('/user/new-claim', { state: { policy } })}
//                               className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors border border-blue-700"
//                             >
//                               File Claim
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Claims Tab */}
//             {activeTab === 'claims' && (
//               <div className="bg-gray-800 rounded-xl border border-gray-700">
//                 <div className="p-5 border-b border-gray-700">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div>
//                       <h2 className="text-xl font-semibold text-white">Claim History</h2>
//                       <p className="text-sm text-gray-400">{filteredClaims.length} total claims</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="relative">
//                         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
//                         <input
//                           type="text"
//                           placeholder="Search claims..."
//                           className="pl-9 pr-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-white placeholder-gray-500"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                       </div>
//                       <button 
//                         onClick={() => navigate('/user/new-claim')}
//                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
//                       >
//                         <PlusCircleIcon className="w-4 h-4" />
//                         New Claim
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 {filteredClaims.length === 0 ? (
//                   <div className="p-12 text-center">
//                     <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
//                     <h3 className="text-lg font-semibold text-white mb-2">No Claims Yet</h3>
//                     <p className="text-gray-400 mb-6">Start by submitting your first claim</p>
//                     <button 
//                       onClick={() => navigate('/user/new-claim')}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
//                     >
//                       Submit New Claim
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-700">
//                     {[...filteredClaims]
//                       .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
//                       .map(claim => {
//                         const statusInfo = getStatusInfo(claim);
//                         return (
//                           <div key={claim.id} className="p-5 hover:bg-gray-700/30 transition-colors">
//                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-3 mb-3">
//                                   <div className={`p-2 rounded-lg border ${statusInfo.border} ${statusInfo.color}`}>
//                                     {statusInfo.icon}
//                                   </div>
//                                   <div>
//                                     <h3 className="font-semibold text-white">{claim.policy?.name || 'Unknown Policy'}</h3>
//                                     <p className="text-sm text-gray-400 mt-1">
//                                       Submitted on {new Date(claim.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <p className="text-gray-300 line-clamp-2">{claim.description}</p>
//                               </div>
//                               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
//                                 <div className="text-center md:text-right">
//                                   <p className="text-2xl font-bold text-white">
//                                     ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
//                                   </p>
//                                   <p className="text-sm text-gray-400">Claimed Amount</p>
//                                 </div>
//                                 <div className="flex flex-col items-center md:items-end">
//                                   <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.border} ${statusInfo.color}`}>
//                                     {statusInfo.text}
//                                   </span>
//                                   <p className="text-xs text-gray-500 mt-1">Claim ID #{claim.id}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}

//         {/* Activity Section */}
//         <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <UserGroupIcon className="w-5 h-5 text-blue-400" />
//               <h2 className="text-lg font-semibold text-white">Activity</h2>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-gray-900 text-gray-300 text-xs font-medium rounded-full border border-gray-700">ADMIN</span>
//               <button className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
//                 <ArrowPathIcon className="w-4 h-4 text-gray-400" />
//               </button>
//             </div>
//           </div>
//           <div className="space-y-3">
//             <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
//               <div className="w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-800/30">
//                 <CheckCircleIcon className="w-4 h-4 text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-300">Your recent insurance activities and updates will appear here.</p>
//                 <p className="text-xs text-gray-500 mt-1">Just now</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }