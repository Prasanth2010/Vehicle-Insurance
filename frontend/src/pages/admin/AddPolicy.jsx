import { useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

export default function AddPolicy() {
  const [policy, setPolicy] = useState({ 
    name: '', 
    description: '', 
    plan: '', 
    premiumAmount: '' 
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post(`${API_BASE_URL}/admin/policies`, policy);
      setMessage('Policy added successfully!');
      setPolicy({ name: '', description: '', plan: '', premiumAmount: '' });
    } catch (err) {
      setMessage('Error adding policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container-padding py-12 my-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Insurance Policy
            </h1>
            <p className="text-gray-600">
              Create a new insurance policy with the details below
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {message}
            </div>
          )}

          {/* Form */}
          <div className="glass-card rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Comprehensive Vehicle Insurance"
                  value={policy.name}
                  onChange={(e) => setPolicy({...policy, name: e.target.value})}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the coverage, benefits, and terms..."
                  value={policy.description}
                  onChange={(e) => setPolicy({...policy, description: e.target.value})}
                  required
                  rows="4"
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <select
                    value={policy.plan}
                    onChange={(e) => setPolicy({...policy, plan: e.target.value})}
                    required
                    className="input-field"
                  >
                    <option value="">Select plan type</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={policy.premiumAmount}
                    onChange={(e) => setPolicy({...policy, premiumAmount: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPolicy({ name: '', description: '', plan: '', premiumAmount: '' })}
                    className="btn-secondary"
                  >
                    Clear All
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary min-w-[200px] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Adding Policy...
                      </span>
                    ) : 'Add Policy'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Form Guidelines */}
          {/* <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">Guidelines</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use clear and descriptive policy names</li>
              <li>• Include all coverage details in the description</li>
              <li>• Set appropriate premium amounts based on coverage</li>
              <li>• Select the correct plan type for billing cycles</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}