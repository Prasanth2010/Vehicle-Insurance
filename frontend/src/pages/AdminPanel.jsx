import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminPanel() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ 
    users: 0, 
    claims: 0, 
    policies: 0, 
    applications: 0 
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
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
        applications: 0 // Update when you have this endpoint
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    // Mock data - replace with actual API calls
    setRecentActivities([
      { id: 1, type: 'claim', action: 'New claim submitted', user: 'John Doe', time: '2 hours ago', status: 'pending' },
      { id: 2, type: 'policy', action: 'Policy application approved', user: 'Sarah Smith', time: '4 hours ago', status: 'approved' },
      { id: 3, type: 'user', action: 'New user registered', user: 'Mike Johnson', time: '1 day ago', status: 'completed' },
      { id: 4, type: 'surveyor', action: 'Surveyor assigned to claim', user: 'Alex Brown', time: '2 days ago', status: 'in-progress' },
    ]);
  };

  if (!user.id || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-500 mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container-padding py-16 mt-2">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="text-blue-600 font-semibold">{user.firstName}</span>
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={stats.users}
            icon="👥"
            color="blue"
            trend="up"
            trendValue="12%"
            loading={loading}
          />
          <StatCard
            title="Active Policies"
            value={stats.policies}
            icon="📄"
            color="emerald"
            trend="up"
            trendValue="8%"
            loading={loading}
          />
          <StatCard
            title="Total Claims"
            value={stats.claims}
            icon="⚡"
            color="orange"
            trend="down"
            trendValue="3%"
            loading={loading}
          />
          <StatCard
            title="Pending Applications"
            value={stats.applications}
            icon="📝"
            color="purple"
            trend="up"
            trendValue="23%"
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard
                  title="Manage Claims"
                  description="Review and process insurance claims"
                  icon="⚡"
                  link="/admin/claims"
                  count={stats.claims}
                  color="indigo"
                />
                <QuickActionCard
                  title="Add New Policy"
                  description="Create new insurance policy"
                  icon="➕"
                  link="/admin/add-policy"
                  color="blue"
                />
                <QuickActionCard
                  title="View Customers"
                  description="Manage customer accounts"
                  icon="👥"
                  link="/admin/customers"
                  count={stats.users}
                  color="blue"
                />
                <QuickActionCard
                  title="Policy Applications"
                  description="Review pending applications"
                  icon="📝"
                  link="/admin/applications"
                  count={stats.applications}
                  color="blue"
                />
              </div>
            </div>

            {/* Recent Claims */}
            <div className="glass-card rounded-xl p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Claims</h2>
                <a href="/admin/claims" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all →
                </a>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : stats.claims === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No recent claims
                  </div>
                ) : (
                  recentActivities
                    .filter(activity => activity.type === 'claim')
                    .map(activity => (
                      <ActivityItem key={activity.id} {...activity} />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <div className="glass-card rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600">{activity.icon || '📌'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Health</span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      <span className="text-sm font-medium text-emerald-600">Operational</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      <span className="text-sm font-medium text-emerald-600">Connected</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-gray-900">99.9%</span>
                  </div>
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
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  const trendIcon = trend === 'up' ? '↗' : '↘';

  return (
    <div className={`rounded-xl border p-5 ${colorClasses[color]} card-hover`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-sm font-medium ${trendColor}`}>
          {trendIcon} {trendValue}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

// function QuickActionCard({ title, description, icon, link, count, color }) {
//   const colorClasses = {
//     blue: 'bg-blue-600 hover:bg-blue-700',
//     emerald: 'bg-emerald-600 hover:bg-emerald-700',
//     purple: 'bg-purple-600 hover:bg-purple-700',
//     orange: 'bg-orange-600 hover:bg-orange-700'
//   };

//   return (
//     <a
//       href={link}
//       className={`rounded-xl text-white p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${colorClasses[color]}`}
//     >
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-2xl">{icon}</div>
//         {count !== undefined && (
//           <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
//             {count}
//           </span>
//         )}
//       </div>
//       <div>
//         <div className="font-semibold text-lg mb-1">{title}</div>
//         <div className="text-sm opacity-90">{description}</div>
//       </div>
//     </a>
//   );
// }

function QuickActionCard({ title, description, icon, link, count, color }) {
  const colorClasses = {
    blue: 'bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700',
    emerald: 'bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700',
    purple: 'bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700',
    orange: 'bg-white border border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-700',
    red: 'bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-700',
    indigo: 'bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700',
    teal: 'bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-teal-700',
    violet: 'bg-white border border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-700',
    amber: 'bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-700',
    cyan: 'bg-white border border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 text-cyan-700',
    rose: 'bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-700'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
    violet: 'bg-violet-100 text-violet-600',
    amber: 'bg-amber-100 text-amber-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    rose: 'bg-rose-100 text-rose-600'
  };

  const countBgClasses = {
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    teal: 'bg-teal-100 text-teal-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    rose: 'bg-rose-100 text-rose-700'
  };

  return (
    <a
      href={link}
      className={`rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconBgClasses[color]}`}>
          {icon}
        </div>
        {count !== undefined && (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${countBgClasses[color]}`}>
            {count}
          </span>
        )}
      </div>
      <div>
        <div className="font-bold text-gray-900 text-lg mb-2">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </a>
  );
}
function ActivityItem({ action, user, time, status }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600">📋</span>
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{action}</div>
          <div className="text-xs text-gray-500">{user} • {time}</div>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
}