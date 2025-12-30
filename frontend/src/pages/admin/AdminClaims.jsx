import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/admin/claims/${id}/status`, { status });
      setClaims(claims.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container-padding py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims Management</h1>
          <p className="text-gray-600">
            Review and manage all insurance claims submitted by customers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Claims" 
            value={claims.length} 
            color="blue"
          />
          <StatCard 
            title="Pending" 
            value={claims.filter(c => c.status === 'PENDING').length} 
            color="yellow"
          />
          <StatCard 
            title="Approved" 
            value={claims.filter(c => c.status === 'APPROVED').length} 
            color="emerald"
          />
          <StatCard 
            title="Rejected" 
            value={claims.filter(c => c.status === 'REJECTED').length} 
            color="red"
          />
        </div>

        {/* Claims List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Loading claims...</p>
            </div>
          ) : claims.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
              <p className="text-gray-500">No claims have been submitted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Claim Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium mb-1">
                          {claim.description?.substring(0, 60)}...
                        </div>
                        {claim.damagePhotoPath && (
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => window.open(`http://localhost:8080${claim.damagePhotoPath}`, '_blank')}
                          >
                            View Damage Photos →
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{claim.policy?.name}</div>
                        <div className="text-xs text-gray-500">{claim.policy?.plan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-semibold">
                              {claim.user?.firstName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {claim.user?.firstName} {claim.user?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{claim.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={claim.status}
                          onChange={(e) => updateStatus(claim.id, e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                                   focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>
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
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{title}</div>
    </div>
  );
}