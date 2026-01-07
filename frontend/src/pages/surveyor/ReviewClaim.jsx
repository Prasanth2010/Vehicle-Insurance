// src/pages/surveyor/ReviewClaim.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SurveyorNavbar from '../../components/SurveyorNavbar';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

export default function ReviewClaim() {
  const navigate = useNavigate();
  const location = useLocation();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const claim = location.state?.claim;

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [submitting, setSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({
    recommendedAmount: '',
    surveyReport: '',
    surveyPhotos: [],
    recommendation: 'APPROVED'
  });

  useEffect(() => {
    if (!claim) {
      alert('Claim data not found. Please go back to dashboard.');
      navigate('/surveyor/panel');
    }
  }, [claim, navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 photos allowed');
      e.target.value = '';
      return;
    }
    setReviewData({ ...reviewData, surveyPhotos: files });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.recommendedAmount || !reviewData.surveyReport.trim()) {
      alert('Please fill recommended amount and survey report');
      return;
    }

    const formData = new FormData();
    formData.append('recommendedAmount', reviewData.recommendedAmount);
    formData.append('surveyReport', reviewData.surveyReport);
    formData.append('recommendation', reviewData.recommendation);
    reviewData.surveyPhotos.forEach(photo => formData.append('surveyPhotos', photo));

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/claims/${claim.id}/survey-report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Review submitted successfully — Recommendation: ${reviewData.recommendation}`);
      navigate('/surveyor/panel');
    } catch (err) {
      alert('Failed to submit review: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!claim) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyorNavbar />

      <div className=" mx-auto px-4 py-12 mt-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/surveyor/panel')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium text-lg"
        >
          <ArrowLeftIcon className="w-6 h-6" />
          Back to Dashboard
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-200 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">Review Claim #{claim.id}</h1>
            <p className="text-xl opacity-90">
              {claim.policy?.name} • {claim.user?.firstName} {claim.user?.lastName}
            </p>
          </div>

          <div className="p-8 space-y-10">
            {/* Claim Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Customer Report */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Damage Report</h3>
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <p className="text-gray-800 leading-relaxed text-lg">{claim.description}</p>
                </div>
                {claim.damagePhotoPath && (
                  <div>
                    <p className="font-bold text-gray-900 mb-4 text-lg">Damage Photo Submitted by Customer</p>
                    <img 
                      src={`${API_BASE_URL}${claim.damagePhotoPath}`}
                      alt="Customer damage"
                      className="w-full rounded-2xl border-4 border-gray-300 shadow-xl"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=Photo+Not+Available'}
                    />
                  </div>
                )}
              </div>

              {/* Claimed Coverages */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Claimed Coverages</h3>
                <div className="space-y-5">
                  {claim.claimedCoverages?.map(cov => (
                    <div key={cov.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xl font-bold text-indigo-900">{cov.type}</div>
                          <div className="text-gray-700 mt-2">{cov.description}</div>
                        </div>
                        <div className="text-3xl font-bold text-indigo-600">₹{cov.amount}</div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl p-6 border-2 border-indigo-300">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-900">Total Claimed Amount</span>
                      <span className="text-4xl font-bold text-indigo-600">
                        ₹{claim.claimedCoverages?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Survey Review Form */}
            <div className="pt-10 border-t-4 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Survey Assessment</h3>

              <form onSubmit={submitReview} className="space-y-10">
                {/* Recommendation */}
                <div>
                  <label className="block text-xl font-bold text-gray-900 mb-6">
                    Final Recommendation <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <label className="flex items-center p-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl border-4 border-emerald-200 cursor-pointer hover:shadow-xl transition-all">
                      <input
                        type="radio"
                        name="recommendation"
                        value="APPROVED"
                        checked={reviewData.recommendation === 'APPROVED'}
                        onChange={(e) => setReviewData({ ...reviewData, recommendation: e.target.value })}
                        className="w-6 h-6 text-emerald-600 mr-6"
                        required
                      />
                      <div>
                        <div className="text-2xl font-bold text-emerald-800">Approve Claim</div>
                        <div className="text-emerald-700 mt-2">Recommend payment to customer</div>
                      </div>
                    </label>

                    <label className="flex items-center p-8 bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl border-4 border-red-200 cursor-pointer hover:shadow-xl transition-all">
                      <input
                        type="radio"
                        name="recommendation"
                        value="REJECTED"
                        checked={reviewData.recommendation === 'REJECTED'}
                        onChange={(e) => setReviewData({ ...reviewData, recommendation: e.target.value })}
                        className="w-6 h-6 text-red-600 mr-6"
                      />
                      <div>
                        <div className="text-2xl font-bold text-red-800">Reject Claim</div>
                        <div className="text-red-700 mt-2">Claim does not meet policy criteria</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Recommended Amount */}
                <div>
                  <label className="block text-xl font-bold text-gray-900 mb-4">
                    Recommended Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={reviewData.recommendedAmount}
                    onChange={(e) => setReviewData({ ...reviewData, recommendedAmount: e.target.value })}
                    className="w-full px-8 py-6 text-2xl font-bold border-4 border-gray-300 rounded-2xl focus:ring-8 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Survey Report */}
                <div>
                  <label className="block text-xl font-bold text-gray-900 mb-4">
                    Detailed Survey Report <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="12"
                    value={reviewData.surveyReport}
                    onChange={(e) => setReviewData({ ...reviewData, surveyReport: e.target.value })}
                    className="w-full px-8 py-6 text-lg border-4 border-gray-300 rounded-2xl focus:ring-8 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Provide comprehensive findings: damage assessment, verification of incident, parts affected, repair/replacement recommendations, photos analysis, and clear justification for your recommendation..."
                    required
                  />
                </div>

                {/* Photos Upload */}
                <div>
                  <label className="block text-xl font-bold text-gray-900 mb-4">
                    Upload Your Survey Photos (Max 5)
                  </label>
                  <div className="border-6 border-dashed border-gray-400 rounded-3xl p-16 text-center hover:border-blue-500 transition-all bg-gray-50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="survey-photos"
                    />
                    <label htmlFor="survey-photos" className="cursor-pointer block">
                      <PhotoIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                      <p className="text-2xl font-bold text-gray-700 mb-2">Click to upload photos</p>
                      <p className="text-gray-600">JPG, PNG • Max 5 photos • 5MB each</p>
                    </label>

                    {reviewData.surveyPhotos.length > 0 && (
                      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {reviewData.surveyPhotos.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Survey photo ${index + 1}`}
                              className="w-full h-48 object-cover rounded-xl border-4 border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setReviewData({
                                  ...reviewData,
                                  surveyPhotos: reviewData.surveyPhotos.filter((_, i) => i !== index)
                                });
                              }}
                              className="absolute top-3 right-3 bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                              <XMarkIcon className="w-6 h-6" />
                            </button>
                            <p className="text-center mt-3 text-sm font-medium text-gray-700 truncate">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-8 pt-10">
                  <button
                    type="button"
                    onClick={() => navigate('/surveyor/panel')}
                    className="flex-1 py-5 bg-red-500 hover:bg-gray-300 text-white text-xl font-bold rounded-2xl transition-all"
                  >
                    Cancel Review
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all disabled:opacity-70"
                  >
                    {submitting ? 'Submitting Report...' : 'Submit Final Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}