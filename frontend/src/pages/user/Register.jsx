import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNo: '',
    age: '',
    gender: '',
    street: '',
    city: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // First, register the user
      const res = await axios.post('http://localhost:8080/auth/register', formData);
      
      // Show success message
      setSuccess('Registration successful! Redirecting to login...');
      
      // Clear the form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNo: '',
        age: '',
        gender: '',
        street: '',
        city: '',
        pincode: ''
      });
      
      // Reset to step 1
      setStep(1);
      
      // Wait 2 seconds, then redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <StepIndicator number={1} label="Personal Info" active={step === 1} completed={step > 1} />
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <StepIndicator number={2} label="Contact Details" active={step === 2} completed={step > 2} />
            </div>
          </div>

          {/* Form Container */}
          <div className="glass-card rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🚗</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create Your InsurePro Account
              </h1>
              <p className="text-gray-600">
                Join thousands of satisfied customers protecting their vehicles
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-emerald-500 mr-2">✅</span>
                  <p className="text-emerald-700 text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && !success && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Create a strong password"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your age"
                      min="18"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleNext}
                    className="w-full btn-primary py-3"
                  >
                    Continue to Contact Details →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && !success && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="contactNo"
                      required
                      value={formData.contactNo}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your phone number"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                    />
                    <p className="mt-1 text-xs text-gray-500">10-digit number without spaces</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter pincode"
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pincode"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary py-3"
                    >
                      ← Back to Personal Info
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-primary py-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Creating Account...
                        </span>
                      ) : 'Complete Registration'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          {/* {!success && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <BenefitCard
                icon="🛡️"
                title="Full Protection"
                description="Comprehensive coverage for all vehicle types"
              />
              <BenefitCard
                icon="⚡"
                title="Quick Claims"
                description="Fast claim processing with minimal paperwork"
              />
              <BenefitCard
                icon="💰"
                title="Best Rates"
                description="Competitive pricing with flexible payment options"
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
        active ? 'bg-blue-600 text-white' :
        completed ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600' :
        'bg-gray-100 text-gray-400'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className={`text-sm font-medium ${
        active ? 'text-blue-600' :
        completed ? 'text-emerald-600' :
        'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}