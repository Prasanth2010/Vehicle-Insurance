import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  PlusCircleIcon, 
  XMarkIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    policyId: '',
    description: '',
    damagePhoto: null
  });
  const [message, setMessage] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [claimsRes, policiesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/claims/my?userId=${user.id}`),
        axios.get('http://localhost:8080/api/policies')
      ]);
      setClaims(claimsRes.data);
      setPolicies(policiesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setFormData({ ...formData, damagePhoto: file });
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);

    if (!formData.policyId) {
      setMessage('Please select a policy');
      setSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      setMessage('Please enter a description');
      setSubmitting(false);
      return;
    }

    if (!formData.damagePhoto) {
      setMessage('Please select a damage photo');
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('userId', user.id);
      data.append('policyId', formData.policyId);
      data.append('description', formData.description);
      data.append('photo', formData.damagePhoto);

      console.log('FormData contents:');
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const res = await axios.post('http://localhost:8080/api/claims/submit', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('API Response:', res.data);

      setMessage('✅ Claim submitted successfully! Your claim is now pending review.');

      await fetchDashboardData();

      setFormData({ policyId: '', description: '', damagePhoto: null });
      
      const fileInput = document.getElementById('damage-photo-upload');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        setShowClaimForm(false);
        setMessage('');
        setSubmitting(false);
      }, 3000);

    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Failed to submit claim. Please try again.';
      
      if (err.response?.data) {
        errorMessage = err.response.data.message || 
                      err.response.data.error || 
                      err.response.data.details ||
                      JSON.stringify(err.response.data);
      }
      
      setMessage(`❌ Error: ${errorMessage}`);
      setSubmitting(false);
    }
  };

  if (!user || !user.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please login to access your dashboard.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const userStats = {
    totalPolicies: policies.length,
    activeClaims: claims.filter(c => c.status === 'PENDING').length,
    approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
    rejectedClaims: claims.filter(c => c.status === 'REJECTED').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-16 mt-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600">Manage your insurance claims and policies in one place</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowClaimForm(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Submit New Claim
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Policies" 
            value={userStats.totalPolicies} 
            color="blue"
            icon={<DocumentTextIcon className="w-6 h-6" />}
          />
          <StatCard 
            title="Pending Claims" 
            value={userStats.activeClaims} 
            color="yellow"
            icon={<ClockIcon className="w-6 h-6" />}
          />
          <StatCard 
            title="Approved Claims" 
            value={userStats.approvedClaims} 
            color="emerald"
            icon={<CheckCircleIcon className="w-6 h-6" />}
          />
          <StatCard 
            title="Rejected Claims" 
            value={userStats.rejectedClaims} 
            color="red"
            icon={<XCircleIcon className="w-6 h-6" />}
          />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabButton>
              <TabButton
                active={activeTab === 'policies'}
                onClick={() => setActiveTab('policies')}
              >
                My Policies
              </TabButton>
              <TabButton
                active={activeTab === 'claims'}
                onClick={() => setActiveTab('claims')}
              >
                Claim History
              </TabButton>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recent Claims */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Recent Claims</h2>
                      <p className="text-gray-600 text-sm mt-1">Latest claim activities</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('claims')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      View all →
                    </button>
                  </div>
                  {claims.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📄</div>
                      <p>No claims submitted yet</p>
                      <button
                        onClick={() => setShowClaimForm(true)}
                        className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                      >
                        <PlusCircleIcon className="w-4 h-4" />
                        Submit Your First Claim
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {claims.slice(0, 3).map(claim => (
                        <ClaimItem key={claim.id} claim={claim} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Policies */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Available Policies</h2>
                      <p className="text-gray-600 text-sm mt-1">Insurance plans you can claim</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('policies')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      View all →
                    </button>
                  </div>
                  {policies.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">🛡️</div>
                      <p>No policies available</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {policies.slice(0, 3).map(policy => (
                          <PolicyItem key={policy.id} policy={policy} setShowClaimForm={setShowClaimForm} setFormData={setFormData} />
                        ))}
                      </div>
                      {policies.length > 3 && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => setActiveTab('policies')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View all policies →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Available Policies</h2>
                  <p className="text-gray-600 text-sm mt-1">{policies.length} policies available</p>
                </div>
                {policies.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <ShieldCheckIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>No policies available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {policies.map(policy => (
                      <div key={policy.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                                <div className="flex items-center gap-2 mt-3">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    {policy.plan}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    policy.status === 'active' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {policy.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{policy.premiumAmount}
                            </div>
                            <div className="text-sm text-gray-500">
                              {policy.plan === 'Monthly' ? 'per month' : 'per year'}
                            </div>
                            <button 
                              onClick={() => {
                                setFormData({...formData, policyId: policy.id});
                                setShowClaimForm(true);
                              }}
                              className="mt-3 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              File Claim →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Claims Tab */}
            {activeTab === 'claims' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Claim History</h2>
                      <p className="text-gray-600 text-sm mt-1">{claims.length} total claims</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        Total: {claims.length}
                      </span>
                    </div>
                  </div>
                </div>
                {claims.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Claims Submitted</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      You haven't submitted any insurance claims yet. Submit your first claim to get started.
                    </p>
                    <button
                      onClick={() => setShowClaimForm(true)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Submit Your First Claim
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {claims.map(claim => (
                      <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{claim.policy?.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {claim.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Submitted on {new Date(claim.submissionDate || claim.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Claim ID: {claim.id}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{claim.description}</p>

                        {claim.damagePhotoPath && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                              <PhotoIcon className="w-4 h-4" />
                              <span className="font-medium">Damage Photo</span>
                            </div>
                            <img 
                              src={`http://localhost:8080${claim.damagePhotoPath}`} 
                              alt="Damage" 
                              className="w-full max-w-md rounded-lg border border-gray-300 shadow-sm"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          </div>
                        )}

                        {claim.surveyReport && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>Survey Report</span>
                            </div>
                            <p className="text-sm text-blue-700">{claim.surveyReport}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Claim Submission Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            onClick={() => {
              if (!submitting) {
                setShowClaimForm(false);
                setMessage('');
                setFormData({ policyId: '', description: '', damagePhoto: null });
              }
            }}
          />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100 opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Submit New Claim</h2>
                <button
                  onClick={() => {
                    if (!submitting) {
                      setShowClaimForm(false);
                      setMessage('');
                      setFormData({ policyId: '', description: '', damagePhoto: null });
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={submitting}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {message && (
                <div className={`mx-6 mt-4 p-4 rounded-lg border ${
                  message.includes('✅') 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {message.includes('✅') ? (
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                    )}
                    <span className="font-medium">{message}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitClaim} className="p-6 space-y-6">
                {/* Policy Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Policy <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.policyId}
                    onChange={(e) => {
                      setFormData({...formData, policyId: e.target.value});
                      setMessage('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    <option value="">Choose your insurance policy</option>
                    {policies.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.premiumAmount} ({p.plan})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Damage Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({...formData, description: e.target.value});
                      setMessage('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Describe the incident, damage details, and any relevant information..."
                    disabled={submitting}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Damage Photo <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Max 5MB)</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    formData.damagePhoto 
                      ? 'border-emerald-300 bg-emerald-50/50' 
                      : 'border-gray-300 hover:border-blue-400'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                      id="damage-photo-upload"
                      disabled={submitting}
                    />
                    <label 
                      htmlFor="damage-photo-upload" 
                      className={`cursor-pointer block ${submitting ? 'cursor-not-allowed' : ''}`}
                    >
                      <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <div className="text-sm text-gray-600 mb-2">
                        {formData.damagePhoto ? 'Change photo' : 'Click to upload photos of the damage'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </div>
                    </label>
                    {formData.damagePhoto && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <PhotoIcon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {formData.damagePhoto.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(formData.damagePhoto.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({...formData, damagePhoto: null});
                              const fileInput = document.getElementById('damage-photo-upload');
                              if (fileInput) fileInput.value = '';
                            }}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                            disabled={submitting}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (!submitting) {
                        setShowClaimForm(false);
                        setMessage('');
                        setFormData({ policyId: '', description: '', damagePhoto: null });
                      }
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <PlusCircleIcon className="w-5 h-5" />
                        Submit Claim
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    red: 'bg-red-50 border-red-100'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ClaimItem({ claim }) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[claim.status]}`}>
              {claim.status}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(claim.submissionDate || claim.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900">{claim.policy?.name || 'Unknown Policy'}</h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{claim.description}</p>
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ policy, setShowClaimForm, setFormData }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{policy.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{policy.description}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium whitespace-nowrap">
          {policy.plan}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-gray-900">
          ₹{policy.premiumAmount}
        </div>
        <button 
          onClick={() => {
            setFormData({policyId: policy.id, description: '', damagePhoto: null});
            setShowClaimForm(true);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          File Claim →
        </button>
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import StatCard from '../components/shared/StatCard';

// export default function UserDashboard() {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const [claims, setClaims] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [formData, setFormData] = useState({
//     policyId: '',
//     description: '',
//     damagePhoto: null // Changed from 'photo' to 'damagePhoto'
//   });
//   const [message, setMessage] = useState('');
//   const [showClaimForm, setShowClaimForm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (user.id) {
//       fetchDashboardData();
//     }
//   }, [user.id]);

//   const fetchDashboardData = async () => {
//     try {
//       const [claimsRes, policiesRes] = await Promise.all([
//         axios.get(`http://localhost:8080/api/claims/my?userId=${user.id}`),
//         axios.get('http://localhost:8080/api/policies')
//       ]);
//       setClaims(claimsRes.data);
//       setPolicies(policiesRes.data);
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         setMessage('File size must be less than 5MB');
//         e.target.value = ''; // Clear the file input
//         return;
//       }
//       setFormData({ ...formData, damagePhoto: file }); 
//     }
//   };

//   const handleSubmitClaim = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setSubmitting(true);

//     // Validation
//     if (!formData.policyId) {
//       setMessage('Please select a policy');
//       setSubmitting(false);
//       return;
//     }

//     if (!formData.description.trim()) {
//       setMessage('Please enter a description');
//       setSubmitting(false);
//       return;
//     }

//     if (!formData.damagePhoto) { // Changed to 'damagePhoto'
//       setMessage('Please select a damage photo');
//       setSubmitting(false);
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append('userId', user.id);
//       data.append('policyId', formData.policyId);
//       data.append('description', formData.description);
//       data.append('damagePhoto', formData.damagePhoto); // Must match backend expectation

//       console.log('FormData contents:');
//       for (let [key, value] of data.entries()) {
//         console.log(key, value);
//       }

//       const res = await axios.post('http://localhost:8080/api/claims/submit', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log('API Response:', res.data);

//       // Show success message
//       setMessage('✅ Claim submitted successfully! Your claim is now pending review.');

//       // Refresh claims data
//       await fetchDashboardData();

//       // Reset form
//       setFormData({ policyId: '', description: '', damagePhoto: null });
      
//       // Reset file input
//       const fileInput = document.getElementById('damage-photo-upload');
//       if (fileInput) fileInput.value = '';
      
//       // Close modal after 3 seconds
//       setTimeout(() => {
//         setShowClaimForm(false);
//         setMessage('');
//         setSubmitting(false);
//       }, 3000);

//     } catch (err) {
//       console.error('Full error:', err);
//       console.error('Error response:', err.response?.data);
//       console.error('Error status:', err.response?.status);
      
//       let errorMessage = 'Failed to submit claim. Please try again.';
      
//       if (err.response?.data) {
//         // Try different possible error message fields
//         errorMessage = err.response.data.message || 
//                       err.response.data.error || 
//                       err.response.data.details ||
//                       JSON.stringify(err.response.data);
//       }
      
//       setMessage(`❌ Error: ${errorMessage}`);
//       setSubmitting(false);
//     }
//   };

//   if (!user.id) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl text-blue-500 mb-4">🔒</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
//           <p className="text-gray-600 mb-6">Please login to access your dashboard</p>
//           <Link to="/login" className="btn-primary px-6 py-3">
//             Sign In Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const userStats = {
//     totalPolicies: policies.length,
//     activeClaims: claims.filter(c => c.status === 'PENDING').length,
//     approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
//     rejectedClaims: claims.filter(c => c.status === 'REJECTED').length
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="container-padding py-20 px-5">
//         {/* Welcome Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
//               <p className="text-gray-600 mt-2">Here's your insurance dashboard</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setShowClaimForm(true)}
//                 className="btn-primary px-6 py-2.5"
//               >
//                 + New Claim
//               </button>
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center">
//                 <span className="text-white font-semibold">
//                   {user.firstName?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <StatCard 
//             title="Total Policies" 
//             value={userStats.totalPolicies} 
//             color="blue"
//             icon="📄"
//           />
//           <StatCard 
//             title="Pending Claims" 
//             value={userStats.activeClaims} 
//             color="yellow"
//             icon="⏳"
//           />
//           <StatCard 
//             title="Approved Claims" 
//             value={userStats.approvedClaims} 
//             color="emerald"
//             icon="✅"
//           />
//           <StatCard 
//             title="Rejected Claims" 
//             value={userStats.rejectedClaims} 
//             color="red"
//             icon="❌"
//           />
//         </div>

//         {/* Tabs */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               <TabButton
//                 active={activeTab === 'overview'}
//                 onClick={() => setActiveTab('overview')}
//               >
//                 Overview
//               </TabButton>
//               <TabButton
//                 active={activeTab === 'policies'}
//                 onClick={() => setActiveTab('policies')}
//               >
//                 My Policies
//               </TabButton>
//               <TabButton
//                 active={activeTab === 'claims'}
//                 onClick={() => setActiveTab('claims')}
//               >
//                 Claim History
//               </TabButton>
//             </nav>
//           </div>
//         </div>

//         {/* Claim Form Modal with fade effect */}
//         {showClaimForm && (
//           <div className="fixed inset-0 z-50">
//             {/* Backdrop with fade effect */}
//             <div 
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
//               onClick={() => {
//                 if (!submitting) {
//                   setShowClaimForm(false);
//                   setMessage('');
//                   setFormData({ policyId: '', description: '', damagePhoto: null });
//                 }
//               }}
//             />
            
//             {/* Modal Content */}
//             <div className="fixed inset-0 flex items-center justify-center p-4">
//               <div 
//                 className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100 opacity-100"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-gray-900">Submit New Claim</h2>
//                     <button
//                       onClick={() => {
//                         if (!submitting) {
//                           setShowClaimForm(false);
//                           setMessage('');
//                           setFormData({ policyId: '', description: '', damagePhoto: null });
//                         }
//                       }}
//                       className="text-gray-400 hover:text-gray-500 text-2xl transition-colors disabled:opacity-50"
//                       disabled={submitting}
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   {message && (
//                     <div className={`mb-6 p-4 rounded-lg animate-fadeIn ${
//                       message.includes('✅') 
//                         ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
//                         : 'bg-red-50 border border-red-200 text-red-700'
//                     }`}>
//                       <div className="flex items-center">
//                         <span className="mr-2">{message.includes('✅') ? '✅' : '❌'}</span>
//                         <p className="font-medium">{message}</p>
//                       </div>
//                     </div>
//                   )}

//                   <form onSubmit={handleSubmitClaim} className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Policy *
//                       </label>
//                       <select
//                         required
//                         value={formData.policyId}
//                         onChange={(e) => {
//                           setFormData({...formData, policyId: e.target.value});
//                           setMessage('');
//                         }}
//                         className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
//                         disabled={submitting}
//                       >
//                         <option value="">Choose a policy</option>
//                         {policies.map(p => (
//                           <option key={p.id} value={p.id}>
//                             {p.name} - ₹{p.premiumAmount} ({p.plan})
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Description of Damage *
//                       </label>
//                       <textarea
//                         required
//                         rows="4"
//                         value={formData.description}
//                         onChange={(e) => {
//                           setFormData({...formData, description: e.target.value});
//                           setMessage('');
//                         }}
//                         className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
//                         placeholder="Please describe the damage in detail..."
//                         disabled={submitting}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Upload Damage Photos *
//                       </label>
//                       <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                         formData.damagePhoto 
//                           ? 'border-emerald-300 bg-emerald-50/50' 
//                           : 'border-gray-300 hover:border-blue-400'
//                       } ${submitting ? 'opacity-50' : ''}`}>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           required
//                           onChange={handleFileChange}
//                           className="hidden"
//                           id="damage-photo-upload"
//                           disabled={submitting}
//                         />
//                         <label 
//                           htmlFor="damage-photo-upload" 
//                           className={`cursor-pointer block ${submitting ? 'cursor-not-allowed' : ''}`}
//                         >
//                           <div className="text-3xl mb-2">📸</div>
//                           <div className="text-sm text-gray-600 mb-2">
//                             {formData.damagePhoto ? 'Change photo' : 'Click to upload photos of the damage'}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Supported formats: JPG, PNG, GIF (Max 5MB)
//                           </div>
//                         </label>
//                         {formData.damagePhoto && (
//                           <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center space-x-3">
//                                 <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
//                                   <span className="text-emerald-600">📎</span>
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
//                                     {formData.damagePhoto.name}
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     {(formData.damagePhoto.size / 1024 / 1024).toFixed(2)} MB
//                                   </div>
//                                 </div>
//                               </div>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setFormData({...formData, damagePhoto: null});
//                                   const fileInput = document.getElementById('damage-photo-upload');
//                                   if (fileInput) fileInput.value = '';
//                                 }}
//                                 className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
//                                 disabled={submitting}
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex space-x-4 pt-6 border-t border-gray-200">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (!submitting) {
//                             setShowClaimForm(false);
//                             setMessage('');
//                             setFormData({ policyId: '', description: '', damagePhoto: null });
//                           }
//                         }}
//                         className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={submitting}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={submitting}
//                       >
//                         {submitting ? (
//                           <span className="flex items-center justify-center">
//                             <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                             </svg>
//                             Submitting...
//                           </span>
//                         ) : 'Submit Claim'}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Content based on active tab */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <p className="mt-4 text-gray-500">Loading dashboard...</p>
//           </div>
//         ) : (
//           <>
//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//               <div className="space-y-8">
//                 {/* Recent Claims */}
//                 <div className="glass-card rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
//                     <button
//                       onClick={() => setActiveTab('claims')}
//                       className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       View all →
//                     </button>
//                   </div>
//                   {claims.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <div className="text-4xl mb-4">📄</div>
//                       <p>No claims submitted yet</p>
//                       <button
//                         onClick={() => setShowClaimForm(true)}
//                         className="mt-4 btn-primary px-4 py-2 text-sm"
//                       >
//                         Submit Your First Claim
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {claims.slice(0, 3).map(claim => (
//                         <ClaimItem key={claim.id} claim={claim} />
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Available Policies */}
//                 <div className="glass-card rounded-xl p-6">
//                   <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Policies</h2>
//                   {policies.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <div className="text-4xl mb-4">🛡️</div>
//                       <p>No policies available</p>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {policies.slice(0, 3).map(policy => (
//                           <PolicyItem key={policy.id} policy={policy} />
//                         ))}
//                       </div>
//                       {policies.length > 3 && (
//                         <div className="text-center mt-6">
//                           <button
//                             onClick={() => setActiveTab('policies')}
//                             className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                           >
//                             View all policies →
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Policies Tab */}
//             {activeTab === 'policies' && (
//               <div className="glass-card rounded-xl overflow-hidden">
//                 <div className="p-6 border-b border-gray-200">
//                   <h2 className="text-lg font-semibold text-gray-900">Available Policies</h2>
//                 </div>
//                 {policies.length === 0 ? (
//                   <div className="p-12 text-center text-gray-500">
//                     <div className="text-4xl mb-4">🛡️</div>
//                     <p>No policies available</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200">
//                     {policies.map(policy => (
//                       <div key={policy.id} className="p-6 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <h3 className="font-medium text-gray-900">{policy.name}</h3>
//                             <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
//                             <div className="flex items-center space-x-2 mt-2">
//                               <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
//                                 {policy.plan}
//                               </span>
//                               <span className={`px-2 py-1 rounded text-xs font-medium ${
//                                 policy.status === 'active' 
//                                   ? 'bg-emerald-100 text-emerald-800' 
//                                   : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {policy.status}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-lg font-semibold text-gray-900">
//                               ₹{policy.premiumAmount}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {policy.plan === 'Monthly' ? 'per month' : 'per year'}
//                             </div>
//                             <button 
//                               onClick={() => {
//                                 setFormData({...formData, policyId: policy.id});
//                                 setShowClaimForm(true);
//                               }}
//                               className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
//                             >
//                               File Claim →
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
//               <div className="glass-card rounded-xl overflow-hidden">
//                 <div className="p-6 border-b border-gray-200">
//                   <h2 className="text-lg font-semibold text-gray-900">Claim History</h2>
//                 </div>
//                 {claims.length === 0 ? (
//                   <div className="p-12 text-center text-gray-500">
//                     <div className="text-4xl mb-4">📄</div>
//                     <p>No claims submitted yet</p>
//                     <button
//                       onClick={() => setShowClaimForm(true)}
//                       className="mt-4 btn-primary px-4 py-2 text-sm"
//                     >
//                       Submit Your First Claim
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200">
//                     {claims.map(claim => (
//                       <ClaimItem key={claim.id} claim={claim} detailed />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function TabButton({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
//         active
//           ? 'border-blue-500 text-blue-600'
//           : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function ClaimItem({ claim, detailed = false }) {
//   const statusColors = {
//     PENDING: 'bg-yellow-100 text-yellow-800',
//     APPROVED: 'bg-emerald-100 text-emerald-800',
//     REJECTED: 'bg-red-100 text-red-800'
//   };

//   const statusIcons = {
//     PENDING: '⏳',
//     APPROVED: '✅',
//     REJECTED: '❌'
//   };

//   return (
//     <div className={`${detailed ? 'p-6' : 'p-4'} hover:bg-gray-50 transition-colors rounded-lg border border-gray-100`}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center space-x-3 mb-3">
//             <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2 ${statusColors[claim.status]}`}>
//               <span>{statusIcons[claim.status]}</span>
//               <span>{claim.status}</span>
//             </div>
//             <div className="text-sm text-gray-500">
//               {new Date(claim.submissionDate || claim.createdAt).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//             </div>
//           </div>
//           <h3 className="font-semibold text-gray-900">{claim.policy?.name || 'Unknown Policy'}</h3>
//           <p className="text-sm text-gray-600 mt-2 line-clamp-2">{claim.description}</p>
//           {detailed && claim.damagePhotoPath && (
//             <button
//               onClick={() => window.open(`http://localhost:8080${claim.damagePhotoPath}`, '_blank')}
//               className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors"
//             >
//               <span className="mr-1">🖼️</span>
//               View Damage Photos
//             </button>
//           )}
//         </div>
//         {!detailed && (
//           <div className="text-sm text-gray-500">
//             {claim.policy?.plan}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function PolicyItem({ policy }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="font-semibold text-gray-900 line-clamp-1">{policy.name}</h3>
//         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
//           {policy.plan}
//         </span>
//       </div>
//       <p className="text-sm text-gray-600 line-clamp-2 mb-4">{policy.description}</p>
//       <div className="flex items-center justify-between">
//         <div className="text-lg font-bold text-gray-900">
//           ₹{policy.premiumAmount}
//         </div>
//         <span className="text-sm text-gray-500">
//           {policy.plan === 'Monthly' ? 'per month' : 'per year'}
//         </span>
//       </div>
//     </div>
//   );
// }

