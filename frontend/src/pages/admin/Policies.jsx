import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import AdminNavbar from '../../components/AdminNavbar';

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/policies');
      setPolicies(res.data);
    } catch (err) {
      console.error('Failed to fetch policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const deactivatePolicy = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this policy? Existing customers will keep their coverage.')) {
      try {
        await axios.put(`http://localhost:8080/api/policies/${id}/inactive`);
        setPolicies(policies.map(p => p.id === id ? { ...p, status: 'inactive' } : p));
      } catch (err) {
        console.error('Failed to deactivate policy:', err);
        alert('Failed to deactivate policy');
      }
    }
  };

  const activatePolicy = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/policies/${id}/active`);
      setPolicies(policies.map(p => p.id === id ? { ...p, status: 'active' } : p));
    } catch (err) {
      console.error('Failed to activate policy:', err);
      alert('Failed to activate policy');
    }
  };

  const deletePolicy = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete policy "${name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:8080/api/policies/${id}`);
        setPolicies(policies.filter(p => p.id !== id));
      } catch (err) {
        console.error('Failed to delete policy:', err);
        alert('Failed to delete policy');
      }
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = !searchQuery || 
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'ALL' || policy.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    inactive: policies.filter(p => p.status === 'inactive').length,
    monthly: policies.filter(p => p.plan === 'Monthly').length,
    yearly: policies.filter(p => p.plan === 'Yearly').length,
    quarterly: policies.filter(p => p.plan === 'Quarterly').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container-padding py-8 pt-24 px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
              <p className="text-gray-600 mt-2">Manage all insurance policies in the system</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Total Coverage:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {stats.total} Policies
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total" value={stats.total} color="blue" />
          <StatCard title="Active" value={stats.active} color="emerald" />
          <StatCard title="Inactive" value={stats.inactive} color="gray" />
          <StatCard title="Monthly" value={stats.monthly} color="purple" />
          <StatCard title="Yearly" value={stats.yearly} color="orange" />
          <StatCard title="Quarterly" value={stats.quarterly} color="cyan" />
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search policies by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Plans</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
              <button
                onClick={fetchPolicies}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
              <Link
                to="/admin/add-policy"
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center"
              >
                <span className="mr-2">+</span>
                Add Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Policies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading policies...</p>
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'No policies have been created yet'}
            </p>
            <Link
              to="/admin/add-policy"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <span className="mr-2">+</span>
              Create First Policy
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map(policy => (
              <div key={policy.id} className="glass-card rounded-xl p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{policy.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                        policy.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${policy.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                        {policy.status || 'active'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {policy.plan}
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ₹{policy.premiumAmount}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {policy.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Policy ID:</span>
                    <span className="font-medium">POL-{policy.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Premium:</span>
                    <span className="font-medium">
                      ₹{policy.premiumAmount} / {policy.plan === 'Monthly' ? 'month' : policy.plan === 'Yearly' ? 'year' : 'quarter'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">
                      {policy.createdAt ? new Date(policy.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200">
                  {/* View Button */}
                  <Link
                    to={`/admin/policy-details/${policy.id}`}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                    title="View Details"
                  >
                    👁️
                  </Link>

                  {/* Edit Button */}
                  <Link
                    to={`/admin/edit-policy/${policy.id}`}
                    className="p-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center"
                    title="Edit Policy"
                  >
                    ✏️
                  </Link>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => policy.status === 'active' ? deactivatePolicy(policy.id) : activatePolicy(policy.id)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                      policy.status === 'active'
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                    title={policy.status === 'active' ? 'Deactivate' : 'Activate'}
                  >

                    {policy.status === 'active' ? '🚫' : '✅'}
                    {/* {policy.status === 'Deactive' ? '✅' : '🚫'} */}

                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deletePolicy(policy.id, policy.name)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                    title="Delete Policy"
                  >
                    🗑️
                  </button>
                </div>

                {/* Button Labels (Mobile Only) */}
                <div className="grid grid-cols-4 gap-2 mt-2 md:hidden">
                  <span className="text-xs text-gray-500 text-center">View</span>
                  <span className="text-xs text-gray-500 text-center">Edit</span>
                  <span className="text-xs text-gray-500 text-center">
                    {policy.status === 'active' ? 'Deactivate' : 'Activate'}
                  </span>
                  <span className="text-xs text-gray-500 text-center">Delete</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Quick Summary</h3>
              <p className="text-sm text-gray-600">
                Showing {filteredPolicies.length} of {policies.length} policies
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">₹{policies.reduce((sum, p) => sum + (parseInt(p.premiumAmount) || 0), 0).toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Premium</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{stats.active}</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{stats.monthly}</div>
                <div className="text-xs text-gray-500">Monthly Plans</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700'
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{title}</div>
    </div>
  );
}