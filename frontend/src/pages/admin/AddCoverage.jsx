import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { ArrowLeftIcon, PlusCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AddCoverage() {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [coverage, setCoverage] = useState({ 
    type: '', 
    description: '', 
    amount: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const coverageTypes = [
    'Collision Coverage',
    'Comprehensive Coverage',
    'Liability Coverage',
    'Uninsured Motorist Coverage',
    'Medical Payment Coverage',
    'Roadside Assistance',
    'Rental Reimbursement',
    'Gap Insurance',
    'Personal Injury Protection',
    'Property Damage Liability',
    'Bodily Injury Liability',
    'Custom Equipment Coverage',
    'Trip Interruption Coverage',
    'New Car Replacement',
    'Accident Forgiveness'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`http://localhost:8080/api/policies/${policyId}/coverages`, coverage);
      setMessage('Coverage added successfully!');
      setMessageType('success');
      setCoverage({ type: '', description: '', amount: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding coverage. Please try again.');
      setMessageType('error');
      console.error('Error adding coverage:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoverage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900">
      <AdminNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to={`/admin/policy-details/${policyId}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">Back to Policy</span>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Coverage</h1>
              <p className="text-gray-600">Add coverage to Policy ID: <span className="font-semibold text-blue-600">{policyId}</span></p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="h-1 w-20 bg-blue-600 rounded-full mt-4"></div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                messageType === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {messageType === 'success' ? (
                  <PlusCircleIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <ShieldCheckIcon className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="ml-3 font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Coverage Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Coverage Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={coverage.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-900 text-base"
                >
                  <option value="">Select a coverage type</option>
                  {coverageTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500">Select the type of coverage you want to add</p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter detailed description of the coverage..."
                value={coverage.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
              />
              <p className="text-sm text-gray-500">Describe what this coverage includes and provides</p>
            </div>

            {/* Amount */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Coverage Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  value={coverage.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
              <p className="text-sm text-gray-500">Enter the coverage amount in Indian Rupees</p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Coverage
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/admin/policy-details/${policyId}`)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Information Card */}
        {/* <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5" />
            About Coverage Types
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span><strong>Collision Coverage:</strong> Covers damage to your vehicle from accidents</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span><strong>Comprehensive Coverage:</strong> Protects against theft, vandalism, and natural disasters</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span><strong>Liability Coverage:</strong> Covers injuries and property damage to others</span>
            </li>
          </ul>
        </div> */}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-500 mb-1">Policy ID</div>
            <div className="text-xl font-bold text-blue-600">{policyId}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-500 mb-1">Coverage Types</div>
            <div className="text-xl font-bold text-gray-900">{coverageTypes.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Active Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import AdminNavbar from '../components/AdminNavbar';

// export default function AddCoverage() {
//   const { policyId } = useParams();
//   const [coverage, setCoverage] = useState({ type: '', description: '', amount: '' });
//   const [message, setMessage] = useState('');

//   const types = ['Collision', 'Comprehensive', 'Liability', 'Uninsured Motorist', 'Medical Payment', 'Roadside Assistance', 'Rental Reimbursement', 'Gap Insurance'];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`http://localhost:8080/api/policies/${policyId}/coverages`, coverage);
//       setMessage('Coverage added successfully!');
//       setCoverage({ type: '', description: '', amount: '' });
//     } catch (err) {
//       setMessage('Error adding coverage');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <AdminNavbar />
//       <div className="max-w-4xl mx-auto px-8 py-20">
//         <h1 className="text-6xl font-bold text-lime-400 text-center mb-16">Add Coverage to Policy ID: {policyId}</h1>
//         {message && <p className="text-center text-2xl text-lime-400 mb-8">{message}</p>}
//         <form onSubmit={handleSubmit} className="space-y-12">
//           <select
//             value={coverage.type}
//             onChange={(e) => setCoverage({...coverage, type: e.target.value})}
//             required
//             className="w-full p-6 text-xl bg-gray-900 border-4 border-lime-400 rounded-xl"
//           >
//             <option value="">Select Coverage Type</option>
//             {types.map(t => <option key={t} value={t}>{t}</option>)}
//           </select>
//           <textarea
//             placeholder="Description"
//             value={coverage.description}
//             onChange={(e) => setCoverage({...coverage, description: e.target.value})}
//             required
//             rows="4"
//             className="w-full p-6 text-xl bg-gray-900 border-4 border-lime-400 rounded-xl"
//           />
//           <input
//             placeholder="Coverage Amount"
//             type="number"
//             value={coverage.amount}
//             onChange={(e) => setCoverage({...coverage, amount: e.target.value})}
//             required
//             className="w-full p-6 text-xl bg-gray-900 border-4 border-lime-400 rounded-xl"
//           />
//           <div className="text-center">
//             <button type="submit" className="px-20 py-6 bg-lime-400 text-black text-3xl font-bold rounded-2xl hover:bg-lime-300">
//               Add Coverage
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }