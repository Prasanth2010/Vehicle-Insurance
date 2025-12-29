import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ users: 0, claims: 0, policies: 0, applications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
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
        applications: 0 // You can add this endpoint later
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
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
      
      <div className="container-padding py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-blue-600">{user.firstName}</span>!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your insurance management system today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Users"
            value={stats.users}
            change="+12%"
            trend="up"
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Active Policies"
            value={stats.policies}
            change="+5%"
            trend="up"
            icon="📄"
            color="emerald"
          />
          <StatCard
            title="Total Claims"
            value={stats.claims}
            change="-2%"
            trend="down"
            icon="⚡"
            color="orange"
          />
          <StatCard
            title="Applications"
            value={stats.applications}
            change="+23%"
            trend="up"
            icon="📝"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              title="Add New Policy"
              description="Create a new insurance policy"
              icon="➕"
              link="/admin/add-policy"
              color="blue"
            />
            <QuickAction
              title="Manage Claims"
              description="Review pending claims"
              icon="⚡"
              link="/admin/claims"
              color="emerald"
            />
            <QuickAction
              title="View Applications"
              description="Check policy applications"
              icon="📝"
              link="/admin/applications"
              color="purple"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              action="New claim submitted"
              user="John Doe"
              time="2 hours ago"
              status="pending"
            />
            <ActivityItem
              action="Policy application approved"
              user="Sarah Smith"
              time="4 hours ago"
              status="approved"
            />
            <ActivityItem
              action="Surveyor registered"
              user="Mike Johnson"
              time="1 day ago"
              status="completed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} card-hover`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

function QuickAction({ title, description, icon, link, color }) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    purple: 'bg-purple-600 hover:bg-purple-700'
  };

  return (
    <a
      href={link}
      className={`p-6 rounded-xl text-white ${colorClasses[color]} transition-all duration-200 
                 hover:shadow-lg hover:-translate-y-0.5 flex items-center space-x-4`}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm opacity-90">{description}</div>
      </div>
    </a>
  );
}

function ActivityItem({ action, user, time, status }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-600">👤</span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{action}</div>
          <div className="text-sm text-gray-500">by {user} • {time}</div>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}