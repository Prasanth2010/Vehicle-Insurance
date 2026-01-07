import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  UserPlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AdminPanel() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ 
    users: 0, 
    claims: 0, 
    policies: 0, 
    applications: 0 
  });
  const [systemStatus, setSystemStatus] = useState('Checking...');
  const [statusColor, setStatusColor] = useState('text-gray-600');
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  // const [systemStatus, setSystemStatus] = useState({
  //   api: true,
  //   database: true,
  //   uptime: '99.9%'
  // });

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
    fetchSystemStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, claimsRes, policiesRes] = await Promise.all([
        axios.get('http://localhost:8080/admin/users'),
        axios.get('http://localhost:8080/admin/claims'),
        axios.get('http://localhost:8080/api/policies')
      ]);
      const totalUsers = Object.values(usersRes.data).flat().length;
      setStats({
        users: totalUsers,
        claims: claimsRes.data.length,
        policies: policiesRes.data.length,
        applications: 0
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent claims
      const claimsRes = await axios.get('http://localhost:8080/admin/claims');
      const recentClaims = claimsRes.data
        .slice(-5) // Get last 5 claims
        .map(claim => ({
          id: claim.id,
          type: 'claim',
          action: `New claim submitted - ${claim.policy?.name || 'Policy'}`,
          user: `${claim.user?.firstName || 'User'} ${claim.user?.lastName || ''}`,
          time: calculateTimeAgo(claim.createdAt || claim.submissionDate),
          status: claim.status.toLowerCase(),
          icon: '⚡'
        }));

      // Fetch recent users (adjust endpoint as needed)
      const usersRes = await axios.get('http://localhost:8080/admin/users');
      const recentUsers = Object.values(usersRes.data)
        .flat()
        .slice(-3) // Get last 3 users
        .map(user => ({
          id: user.id,
          type: 'user',
          action: 'New user registered',
          user: `${user.firstName} ${user.lastName}`,
          time: calculateTimeAgo(user.createdAt),
          status: 'completed',
          icon: '👤'
        }));

      // Fetch recent policies
      const policiesRes = await axios.get('http://localhost:8080/api/policies');
      const recentPolicies = policiesRes.data
        .slice(-2) // Get last 2 policies
        .map(policy => ({
          id: policy.id,
          type: 'policy',
          action: `Policy added - ${policy.name}`,
          user: 'Admin',
          time: 'Recently',
          status: 'approved',
          icon: '📄'
        }));

      // Combine and sort by time (most recent first)
      const allActivities = [...recentClaims, ...recentUsers, ...recentPolicies]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6); // Show only 6 most recent

      setRecentActivities(allActivities);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      // Fallback to mock data if API fails
      // setRecentActivities([
      //   { id: 1, type: 'claim', action: 'New claim submitted', user: 'John Doe', time: '2 hours ago', status: 'pending', icon: '⚡' },
      //   { id: 2, type: 'policy', action: 'Policy application approved', user: 'Sarah Smith', time: '4 hours ago', status: 'approved', icon: '📄' },
      //   { id: 3, type: 'user', action: 'New user registered', user: 'Mike Johnson', time: '1 day ago', status: 'completed', icon: '👤' },
      //   { id: 4, type: 'surveyor', action: 'Surveyor assigned to claim', user: 'Alex Brown', time: '2 days ago', status: 'in-progress', icon: '🔧' },
      // ]);
    }
  };

  const calculateTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return past.toLocaleDateString();
  };
const fetchSystemStatus = async () => {
  try {
    const res = await axios.get('http://localhost:8080/actuator/health');
    
    if (res.data.status === 'UP') {
      setSystemStatus('Online');
      setStatusColor('text-Green-600');
    } else {
      setSystemStatus('Down');
      setStatusColor('text-red-600');
    }
  } catch (err) {
    console.error('Health check failed:', err);
    setSystemStatus('Offline');
    setStatusColor('text-red-600');
  }
};
  // const fetchSystemStatus = async () => {
  //   try {
  //     await axios.get('http://localhost:8080/health');
  //     setSystemStatus(prev => ({ ...prev, api: true }));
  //   } catch {
  //     setSystemStatus(prev => ({ ...prev, api: false }));
  //   }
  // };

  const refreshData = () => {
    setLoading(true);
    fetchStats();
    fetchRecentActivities();
    fetchSystemStatus();
  };

  if (!user.id || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <XCircleIcon className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-6">Administrator credentials required to access this panel.</p>
          <Link 
            to="/admin/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminNavbar />
      
      <div className="max-w-10xl mx-auto px-8 sm:px-6 lg:px-8 py-16 mt-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="text-blue-600 font-semibold capitalize">{user.firstName} {user.lastName}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={<UsersIcon className="w-8 h-8" />}
            color="blue"
            trend="up"
            trendValue="12.5%"
            loading={loading}
          />
          <StatCard
            title="Active Policies"
            value={stats.policies}
            icon={<DocumentTextIcon className="w-8 h-8" />}
            color="emerald"
            trend="up"
            trendValue="8.2%"
            loading={loading}
          />
          <StatCard
            title="Total Claims"
            value={stats.claims}
            icon={<ClipboardDocumentListIcon className="w-8 h-8" />}
            color="orange"
            trend="down"
            trendValue="3.1%"
            loading={loading}
          />
          <StatCard
            title="Pending Applications"
            value={stats.applications}
            icon={<ClockIcon className="w-8 h-8" />}
            color="purple"
            trend="up"
            trendValue="23.4%"
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                  <p className="text-gray-600 text-sm mt-1">Manage your insurance system</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Admin Actions</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard
                  title="Manage Claims"
                  description="Review and process insurance claims"
                  icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
                  link="/admin/claims"
                  count={stats.claims}
                  color="indigo"
                />
                <QuickActionCard
                  title="Add New Policy"
                  description="Create new insurance policy"
                  icon={<DocumentTextIcon className="w-6 h-6" />}
                  link="/admin/add-policy"
                  color="blue"
                />
                <QuickActionCard
                  title="View Customers"
                  description="Manage customer accounts"
                  icon={<UserGroupIcon className="w-6 h-6" />}
                  link="/admin/customers"
                  count={stats.users}
                  color="teal"
                />
                <QuickActionCard
                  title="Policy Applications"
                  description="Review pending applications"
                  icon={<CreditCardIcon className="w-6 h-6" />}
                  link="/admin/applications"
                  count={stats.applications}
                  color="purple"
                />
              </div>
            </div>

            {/* Recent Claims */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Claims</h2>
                  <p className="text-gray-600 text-sm mt-1">Latest claim activities</p>
                </div>
                <Link to="/admin/claims" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                  View all <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : stats.claims === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No claims found</p>
                    <Link 
                      to="/admin/claims"
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View all claims →
                    </Link>
                  </div>
                ) : (
                  recentActivities
                    .filter(activity => activity.type === 'claim')
                    .slice(0, 6)
                    .map(activity => (
                      <ActivityItem key={activity.id} {...activity} />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity & System Status */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {recentActivities.length} activities
                </span>
              </div>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent activities</p>
                  </div>
                ) : (
                  recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <div className="flex items-center mt-1 gap-2">
                          <span className="text-xs text-gray-500">{activity.user}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8">System Status</h2>
              {/* <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-current" />
                  <span className={`font-semibold ${statusColor}`}>
                    System: {systemStatus}
                  </span>
                </div> */}
              <div className="space-y-4">
                <StatusItem 
                  title="System:" 
                  status={systemStatus} 
                  isHealthy={true}
                />
                <StatusItem 
                  title="API Server" 
                  status={systemStatus.api ? 'Operational' : 'Degraded'} 
                  isHealthy={systemStatus.api}
                />
                <StatusItem 
                  title="Database" 
                  status="Connected" 
                  isHealthy={true}
                />
                
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-white-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-black">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">System Overview</h3>
                  <p className="text-sm opacity-90 mt-1">Real-time statistics</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Active Sessions</span>
                  <span className="font-bold">{stats.users + 3}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Pending Actions</span>
                  <span className="font-bold">{stats.claims}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Today's Activities</span>
                  <span className="font-bold">{recentActivities.filter(a => a.time.includes('hour') || a.time.includes('Just')).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend, trendValue, loading }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    orange: 'bg-orange-50 border-orange-100',
    purple: 'bg-purple-50 border-purple-100'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className={`rounded-xl border p-6 bg-white shadow-sm hover:shadow-md transition-shadow ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
        <div className={`text-sm font-semibold ${trendColor} flex items-center gap-1`}>
          {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
          {trendValue}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {loading ? (
          <div className="h-7 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, link, count, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-700',
    orange: 'bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700',
    indigo: 'bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700',
    teal: 'bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-700'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600'
  };

  return (
    <Link
      to={link}
      className={`rounded-xl border p-6 transition-all duration-200 hover:shadow-md ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
        {count !== undefined && count > 0 && (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-white border">
            {count}
          </span>
        )}
      </div>
      <div>
        <div className="font-semibold text-gray-900 mb-1">{title}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium">
        <span className={`${color === 'blue' ? 'text-blue-600' : 
                         color === 'emerald' ? 'text-emerald-600' : 
                         color === 'purple' ? 'text-purple-600' : 
                         color === 'orange' ? 'text-orange-600' :
                         color === 'indigo' ? 'text-indigo-600' :
                         'text-teal-600'}`}>
          Access Now →
        </span>
      </div>
    </Link>
  );
}

function ActivityItem({ action, user, time, status, icon }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{action}</div>
          <div className="text-xs text-gray-500">{user} • {time}</div>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    </div>
  );
}

function StatusItem({ title, status, isHealthy, showIcon = true }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showIcon && (
          <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
        )}
        <span className="text-sm font-medium text-black-700">{title}</span>
      </div>
      <span className={`text-sm font-semibold ${
        isHealthy ? 'text-green-600' : 'text-red-600'
      }`}>
        {status}
      </span>
    </div>
  );
}



// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../components/AdminNavbar';

// export default function AdminPanel() {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const [stats, setStats] = useState({ 
//     users: 0, 
//     claims: 0, 
//     policies: 0, 
//     applications: 0 
//   });
//   const [loading, setLoading] = useState(true);
//   const [recentActivities, setRecentActivities] = useState([]);

//   useEffect(() => {
//     fetchStats();
//     fetchRecentActivities();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const [usersRes, claimsRes, policiesRes] = await Promise.all([
//         axios.get('http://localhost:8080/admin/users'),
//         axios.get('http://localhost:8080/admin/claims'),
//         axios.get('http://localhost:8080/api/policies')
//       ]);
//       const totalUsers = Object.values(usersRes.data).flat().length;
//       setStats({
//         users: totalUsers,
//         claims: claimsRes.data.length,
//         policies: policiesRes.data.length,
//         applications: 0 // Update when you have this endpoint
//       });
//     } catch (err) {
//       console.error('Failed to fetch stats:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecentActivities = async () => {
//     // Mock data - replace with actual API calls
//     setRecentActivities([
//       { id: 1, type: 'claim', action: 'New claim submitted', user: 'John Doe', time: '2 hours ago', status: 'pending' },
//       { id: 2, type: 'policy', action: 'Policy application approved', user: 'Sarah Smith', time: '4 hours ago', status: 'approved' },
//       { id: 3, type: 'user', action: 'New user registered', user: 'Mike Johnson', time: '1 day ago', status: 'completed' },
//       { id: 4, type: 'surveyor', action: 'Surveyor assigned to claim', user: 'Alex Brown', time: '2 days ago', status: 'in-progress' },
//     ]);
//   };

//   if (!user.id || user.role !== 'ADMIN') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl text-red-500 mb-4">🚫</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
//           <p className="text-gray-600">You don't have permission to access this page.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminNavbar />
      
//       <div className="container-padding py-16 mt-2 px-4">
//         {/* Welcome Section */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//               <p className="text-gray-600 mt-2">
//                 Welcome back, <span className="text-blue-600 font-semibold">{user.firstName}</span>
//               </p>
//             </div>
//             <div className="text-sm text-gray-500">
//               Last updated: {new Date().toLocaleDateString()}
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <StatCard
//             title="Total Users"
//             value={stats.users}
//             icon="👥"
//             color="blue"
//             trend="up"
//             trendValue="12%"
//             loading={loading}
//           />
//           <StatCard
//             title="Active Policies"
//             value={stats.policies}
//             icon="📄"
//             color="emerald"
//             trend="up"
//             trendValue="8%"
//             loading={loading}
//           />
//           <StatCard
//             title="Total Claims"
//             value={stats.claims}
//             icon="⚡"
//             color="orange"
//             trend="down"
//             trendValue="3%"
//             loading={loading}
//           />
//           <StatCard
//             title="Pending Applications"
//             value={stats.applications}
//             icon="📝"
//             color="purple"
//             trend="up"
//             trendValue="23%"
//             loading={loading}
//           />
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Quick Actions */}
//           <div className="lg:col-span-2">
//             <div className="glass-card rounded-xl p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <QuickActionCard
//                   title="Manage Claims"
//                   description="Review and process insurance claims"
//                   icon="⚡"
//                   link="/admin/claims"
//                   count={stats.claims}
//                   color="indigo"
//                 />
//                 <QuickActionCard
//                   title="Add New Policy"
//                   description="Create new insurance policy"
//                   icon="➕"
//                   link="/admin/add-policy"
//                   color="blue"
//                 />
//                 <QuickActionCard
//                   title="View Customers"
//                   description="Manage customer accounts"
//                   icon="👥"
//                   link="/admin/customers"
//                   count={stats.users}
//                   color="blue"
//                 />
//                 <QuickActionCard
//                   title="Policy Applications"
//                   description="Review pending applications"
//                   icon="📝"
//                   link="/admin/applications"
//                   count={stats.applications}
//                   color="blue"
//                 />
//               </div>
//             </div>

//             {/* Recent Claims */}
//             <div className="glass-card rounded-xl p-6 mt-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Recent Claims</h2>
//                 <a href="/admin/claims" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
//                   View all →
//                 </a>
//               </div>
//               <div className="space-y-4">
//                 {loading ? (
//                   <div className="text-center py-8">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : stats.claims === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     No recent claims
//                   </div>
//                 ) : (
//                   recentActivities
//                     .filter(activity => activity.type === 'claim')
//                     .map(activity => (
//                       <ActivityItem key={activity.id} {...activity} />
//                     ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Recent Activity Sidebar */}
//           <div>
//             <div className="glass-card rounded-xl p-6 sticky top-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
//               <div className="space-y-4">
//                 {recentActivities.map(activity => (
//                   <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
//                     <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//                       <span className="text-blue-600">{activity.icon || '📌'}</span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900">{activity.action}</p>
//                       <div className="flex items-center mt-1 space-x-2">
//                         <span className="text-xs text-gray-500">{activity.user}</span>
//                         <span className="text-xs text-gray-400">•</span>
//                         <span className="text-xs text-gray-500">{activity.time}</span>
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       activity.status === 'approved' ? 'bg-green-100 text-emerald-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {activity.status}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* System Status */}
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-900 mb-4">System Status</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">API Health</span>
//                     <span className="flex items-center">
//                       <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
//                       <span className="text-sm font-medium text-emerald-600">Operational</span>
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Database</span>
//                     <span className="flex items-center">
//                       <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
//                       <span className="text-sm font-medium text-emerald-600">Connected</span>
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Uptime</span>
//                     <span className="text-sm font-medium text-gray-900">99.9%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon, color, trend, trendValue, loading }) {
//   const colorClasses = {
//     blue: 'bg-blue-50 border-blue-200',
//     emerald: 'bg-emerald-50 border-emerald-200',
//     orange: 'bg-orange-50 border-orange-200',
//     purple: 'bg-purple-50 border-purple-200'
//   };

//   const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
//   const trendIcon = trend === 'up' ? '↗' : '↘';

//   return (
//     <div className={`rounded-xl border p-5 ${colorClasses[color]} card-hover`}>
//       <div className="flex items-center justify-between mb-4">
//         <div className="text-2xl">{icon}</div>
//         <div className={`text-sm font-medium ${trendColor}`}>
//           {trendIcon} {trendValue}
//         </div>
//       </div>
//       <div className="text-2xl font-bold text-gray-900 mb-2">
//         {loading ? (
//           <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
//         ) : (
//           value.toLocaleString()
//         )}
//       </div>
//       <div className="text-sm text-gray-600">{title}</div>
//     </div>
//   );
// }

// // function QuickActionCard({ title, description, icon, link, count, color }) {
// //   const colorClasses = {
// //     blue: 'bg-blue-600 hover:bg-blue-700',
// //     emerald: 'bg-emerald-600 hover:bg-emerald-700',
// //     purple: 'bg-purple-600 hover:bg-purple-700',
// //     orange: 'bg-orange-600 hover:bg-orange-700'
// //   };

// //   return (
// //     <a
// //       href={link}
// //       className={`rounded-xl text-white p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${colorClasses[color]}`}
// //     >
// //       <div className="flex items-center justify-between mb-3">
// //         <div className="text-2xl">{icon}</div>
// //         {count !== undefined && (
// //           <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
// //             {count}
// //           </span>
// //         )}
// //       </div>
// //       <div>
// //         <div className="font-semibold text-lg mb-1">{title}</div>
// //         <div className="text-sm opacity-90">{description}</div>
// //       </div>
// //     </a>
// //   );
// // }

// function QuickActionCard({ title, description, icon, link, count, color }) {
//   const colorClasses = {
//     blue: 'bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700',
//     emerald: 'bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700',
//     purple: 'bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700',
//     orange: 'bg-white border border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-700',
//     red: 'bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-700',
//     indigo: 'bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700',
//     teal: 'bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-teal-700',
//     violet: 'bg-white border border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-700',
//     amber: 'bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-700',
//     cyan: 'bg-white border border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 text-cyan-700',
//     rose: 'bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-700'
//   };

//   const iconBgClasses = {
//     blue: 'bg-blue-100 text-blue-600',
//     emerald: 'bg-emerald-100 text-emerald-600',
//     purple: 'bg-purple-100 text-purple-600',
//     orange: 'bg-orange-100 text-orange-600',
//     red: 'bg-red-100 text-red-600',
//     indigo: 'bg-indigo-100 text-indigo-600',
//     teal: 'bg-teal-100 text-teal-600',
//     violet: 'bg-violet-100 text-violet-600',
//     amber: 'bg-amber-100 text-amber-600',
//     cyan: 'bg-cyan-100 text-cyan-600',
//     rose: 'bg-rose-100 text-rose-600'
//   };

//   const countBgClasses = {
//     blue: 'bg-blue-100 text-blue-700',
//     emerald: 'bg-emerald-100 text-emerald-700',
//     purple: 'bg-purple-100 text-purple-700',
//     orange: 'bg-orange-100 text-orange-700',
//     red: 'bg-red-100 text-red-700',
//     indigo: 'bg-indigo-100 text-indigo-700',
//     teal: 'bg-teal-100 text-teal-700',
//     violet: 'bg-violet-100 text-violet-700',
//     amber: 'bg-amber-100 text-amber-700',
//     cyan: 'bg-cyan-100 text-cyan-700',
//     rose: 'bg-rose-100 text-rose-700'
//   };

//   return (
//     <a
//       href={link}
//       className={`rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${colorClasses[color]}`}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconBgClasses[color]}`}>
//           {icon}
//         </div>
//         {count !== undefined && (
//           <span className={`px-3 py-1 rounded-full text-sm font-semibold ${countBgClasses[color]}`}>
//             {count}
//           </span>
//         )}
//       </div>
//       <div>
//         <div className="font-bold text-gray-900 text-lg mb-2">{title}</div>
//         <div className="text-sm text-gray-600">{description}</div>
//       </div>
//     </a>
//   );
// }
// function ActivityItem({ action, user, time, status }) {
//   const statusColors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     approved: 'bg-emerald-100 text-emerald-800',
//     completed: 'bg-blue-100 text-blue-800',
//     'in-progress': 'bg-purple-100 text-purple-800'
//   };

//   return (
//     <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
//       <div className="flex items-center space-x-3">
//         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//           <span className="text-gray-600">📋</span>
//         </div>
//         <div>
//           <div className="font-medium text-gray-900 text-sm">{action}</div>
//           <div className="text-xs text-gray-500">{user} • {time}</div>
//         </div>
//       </div>
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
//         {status}
//       </span>
//     </div>
//   );
// }