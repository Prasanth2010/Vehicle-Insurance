// src/pages/admin/AdminCoverages.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { PlusCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminCoverages() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoliciesWithCoverages();
  }, []);

  const fetchPoliciesWithCoverages = async () => {
    try {
      const policiesRes = await axios.get('http://localhost:8080/api/policies');
      const policiesData = policiesRes.data;

      // Fetch coverages for each policy
      const policiesWithCoverages = await Promise.all(
        policiesData.map(async (policy) => {
          try {
            const covRes = await axios.get(`http://localhost:8080/api/policies/${policy.id}/coverages`);
            return { ...policy, coverages: covRes.data };
          } catch (err) {
            console.warn(`No coverages for policy ${policy.id}`);
            return { ...policy, coverages: [] };
          }
        })
      );

      setPolicies(policiesWithCoverages);
    } catch (err) {
      console.error('Failed to fetch policies:', err);
      alert('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-16 my-5">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Coverages Management</h1>
          <p className="text-gray-600 mt-2">View and manage coverage options for all insurance policies</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading policies and coverages...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Policies Found</h3>
            <p className="text-gray-600">Create policies first to add coverages</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Policy Header */}
                <div className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{policy.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      policy.status === 'active' ? 'bg-white/20' : 'bg-gray-600/30'
                    }`}>
                      {policy.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm mb-4">{policy.description}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-90">Premium</p>
                      <p className="text-3xl font-bold">₹{policy.premiumAmount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Plan</p>
                      <p className="text-xl font-semibold capitalize">{policy.plan}</p>
                    </div>
                  </div>
                </div>

                {/* Coverages List */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Coverages ({policy.coverages.length})
                    </h4>
                    <Link
                      to={`/admin/add-coverage/${policy.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Add Coverage
                    </Link>
                  </div>

                  {policy.coverages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShieldCheckIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No coverages added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {policy.coverages.map((cov) => (
                        <div
                          key={cov.id}
                          className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 text-lg">{cov.type}</h5>
                              <p className="text-sm text-gray-700 mt-1">{cov.description}</p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-indigo-600">₹{cov.amount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}