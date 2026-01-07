// src/pages/user/NewClaim.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function NewClaim() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedPolicy = location.state?.policy; // Optional pre-fill

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [policies, setPolicies] = useState([]);
  const [availableCoverages, setAvailableCoverages] = useState([]);
  const [formData, setFormData] = useState({
    policyId: preselectedPolicy?.id || '',
    selectedCoverages: [],
    description: '',
    damagePhoto: null
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    fetchPolicies();
    if (preselectedPolicy) {
      fetchCoveragesForPolicy(preselectedPolicy.id);
    }
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/policies`);
      setPolicies(res.data);
    } catch (err) {
      setMessage('Failed to load policies');
    }
  };

  const fetchCoveragesForPolicy = async (policyId) => {
    if (!policyId) {
      setAvailableCoverages([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/policies/${policyId}/coverages`);
      setAvailableCoverages(res.data);
    } catch (err) {
      setAvailableCoverages([]);
      setMessage('Could not load coverages');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB');
      e.target.value = '';
      return;
    }
    setFormData({ ...formData, damagePhoto: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);

    if (!formData.policyId || formData.selectedCoverages.length === 0 || !formData.description.trim() || !formData.damagePhoto) {
      setMessage('Please fill all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('userId', user.id);
      data.append('policyId', formData.policyId);
      formData.selectedCoverages.forEach(id => data.append('coverageIds', id));
      data.append('description', formData.description);
      data.append('photo', formData.damagePhoto);

      await axios.post(`${API_BASE_URL}/api/claims/submit-with-coverage`, data);

      setMessage('Claim submitted successfully!');
      setTimeout(() => navigate('/user/dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit New Claim</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${message.includes('success') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Policy Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Select Policy <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.policyId}
                onChange={(e) => {
                  const id = e.target.value;
                  setFormData({ ...formData, policyId: id, selectedCoverages: [] });
                  fetchCoveragesForPolicy(id);
                }}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                required
              >
                <option value="">Choose your policy</option>
                {policies.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ₹{p.premiumAmount} ({p.plan})
                  </option>
                ))}
              </select>
            </div>

            {/* Coverages */}
            {formData.policyId && availableCoverages.length > 0 && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Select Coverages <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  {availableCoverages.map(cov => (
                    <label key={cov.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border hover:border-blue-400 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={formData.selectedCoverages.includes(cov.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, selectedCoverages: [...formData.selectedCoverages, cov.id] });
                            } else {
                              setFormData({ ...formData, selectedCoverages: formData.selectedCoverages.filter(id => id !== cov.id) });
                            }
                          }}
                          className="w-6 h-6 text-blue-600 rounded"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{cov.type}</div>
                          <div className="text-gray-600">{cov.description}</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">₹{cov.amount}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Photo */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Damage Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="6"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Upload Damage Photo <span className="text-red-500">*</span>
              </label>
              <div className="border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo" required />
                <label htmlFor="photo" className="cursor-pointer">
                  <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-700">Click to upload</p>
                </label>
                {formData.damagePhoto && (
                  <div className="mt-6">
                    <img src={URL.createObjectURL(formData.damagePhoto)} alt="Preview" className="max-w-md mx-auto rounded-xl" />
                    <p className="mt-2 text-sm text-gray-600">{formData.damagePhoto.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => navigate('/user/dashboard')}
                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}