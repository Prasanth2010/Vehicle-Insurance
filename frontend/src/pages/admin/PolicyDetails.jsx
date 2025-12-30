import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { PlusIcon, ShieldCheckIcon, CurrencyRupeeIcon, DocumentTextIcon, IdentificationIcon, TagIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function PolicyDetails() {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [coverages, setCoverages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8080/api/policies`),
      axios.get(`http://localhost:8080/api/policies/${id}/coverages`)
    ]).then(([policiesRes, coveragesRes]) => {
      setPolicy(policiesRes.data.find(p => p.id == id));
      setCoverages(coveragesRes.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading policy details...</p>
      </div>
    </div>
  );

  if (!policy) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldCheckIcon className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Policy Not Found</h2>
        <p className="text-gray-600 mb-4">The requested policy could not be found.</p>
        <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-2">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Policy Details</h1>
              <p className="text-gray-600 mt-2">Complete overview of insurance policy id - {policy.id}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                to={`/admin/edit-policy/${policy.id}`}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Policy
              </Link>
            </div>
          </div>
          <div className="h-1 w-20 bg-blue-600 rounded-full mt-4"></div>
        </div>

        {/* Main Policy Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{policy.name}</h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {policy.plan}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 max-w-3xl">{policy.description}</p>
            </div>
          </div>

          {/* Policy Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <IdentificationIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">Policy ID</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{policy.id}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <TagIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">Plan Type</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{policy.plan}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <CurrencyRupeeIcon className="w-5 h-5 text-blue-700" />
                <span className="text-blue-700 font-medium">Premium Amount</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{policy.premiumAmount}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end pt-6 border-t border-gray-200">
            <Link 
              to={`/admin/add-coverage/${policy.id}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Add Coverage
            </Link>
          </div>
        </div>

        {/* Coverages Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coverages</h2>
              <p className="text-gray-600">Protection options included in this policy</p>
            </div>
            <div className="mt-2 sm:mt-0 text-lg font-semibold text-blue-600">
              {coverages.length} Coverage{coverages.length !== 1 ? 's' : ''}
            </div>
          </div>

          {coverages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coverages.map((c, index) => (
                <div 
                  key={c.id} 
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-3">
                        #{index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {c.type}
                      </h3>
                    </div>
                    <div className="text-xl font-bold text-green-600">₹{c.amount}</div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{c.description}</p>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ID: {c.id}</span>
                      <span className="inline-flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-green-600 font-medium">Active</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ShieldCheckIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Coverages Added</h3>
              <p className="text-gray-500 mb-6">Add coverages to enhance this policy's protection</p>
              <Link 
                to={`/admin/add-coverage/${policy.id}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Add First Coverage
              </Link>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Policy Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Created Date:</span>
              <span className="text-gray-900 font-medium ml-2">Not specified</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Last Updated:</span>
              <span className="text-gray-900 font-medium ml-2">Not specified</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Total Coverages:</span>
              <span className="text-gray-900 font-medium ml-2">{coverages.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

