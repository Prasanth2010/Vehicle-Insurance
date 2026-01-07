import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { 
  FaUserTie, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

export default function Surveyors() {
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchSurveyors();
  }, []);

  const fetchSurveyors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users`);
      const allUsers = Array.isArray(res.data) ? res.data : Object.values(res.data).flat();
      const surveyorList = allUsers.filter(u => u.role === 'SURVEYOR');

      setSurveyors(surveyorList);
    } catch (err) {
      console.error('Failed to fetch surveyors:', err);
      alert('Failed to load surveyors');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (surveyor) => {
    setEditingId(surveyor.id);
    setEditForm({
      firstName: surveyor.firstName || '',
      lastName: surveyor.lastName || '',
      email: surveyor.email || '',
      contactNo: surveyor.contactNo || '',
      city: surveyor.city || '',
      pincode: surveyor.pincode || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editForm.firstName || !editForm.lastName || !editForm.email) {
      alert('First name, last name, and email are required');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/admin/users/${editingId}`, editForm);
      alert('Surveyor updated successfully!');
      cancelEdit();
      fetchSurveyors();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update surveyor');
    }
  };

  const toggleStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    if (window.confirm(`Set "${name}" as ${newStatus.toUpperCase()}?`)) {
      try {
        await axios.put(`${API_BASE_URL}/admin/users/${id}/status`, { status: newStatus });
        alert(`Surveyor is now ${newStatus}`);
        fetchSurveyors();
      } catch (err) {
        alert('Failed to update status');
      }
    }
  };

  const deleteSurveyor = async (id, name) => {
    if (window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/users/${id}`);
        alert('Surveyor deleted');
        fetchSurveyors();
      } catch (err) {
        alert('Failed to delete surveyor');
      }
    }
  };

  const filteredSurveyors = surveyors.filter(s =>
    searchQuery === '' ||
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AdminNavbar />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading surveyors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className=" mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Surveyor Management</h1>
          <p className="text-gray-600 mt-2">Edit, activate/deactivate, or delete surveyor accounts</p>
        </div>

        {/* Search */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <span className="absolute left-3 top-3 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>
        </div>

        {/* Surveyors Grid */}
        {filteredSurveyors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <FaUserTie className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3 py-16">No Surveyors Found</h3>
            <p className="text-gray-600">Add your first surveyor to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSurveyors.map((surveyor) => (
              <div key={surveyor.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {surveyor.firstName?.[0]}{surveyor.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {surveyor.firstName} {surveyor.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {surveyor.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    surveyor.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {surveyor.status || 'active'}
                  </span>
                </div>

                {/* Details or Edit Form */}
                {editingId === surveyor.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="First Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      value={editForm.contactNo}
                      onChange={(e) => setEditForm({ ...editForm, contactNo: e.target.value })}
                      placeholder="Phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        placeholder="City"
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        value={editForm.pincode}
                        onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={saveEdit}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium"
                      >
                        <FaSave />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaEnvelope className="text-gray-400" />
                        <span className="text-sm">{surveyor.email}</span>
                      </div>
                      {surveyor.contactNo && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaPhone className="text-gray-400" />
                          <span className="text-sm">{surveyor.contactNo}</span>
                        </div>
                      )}
                      {(surveyor.city || surveyor.pincode) && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span className="text-sm">
                            {surveyor.city}{surveyor.pincode ? `, ${surveyor.pincode}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => startEdit(surveyor)}
                        className="flex flex-col items-center py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        title="Edit Surveyor"
                      >
                        <FaEdit className="w-5 h-5 mb-1" />
                        <span className="text-xs">Edit</span>
                      </button>

                      <button
                        onClick={() => toggleStatus(surveyor.id, surveyor.status || 'active', `${surveyor.firstName} ${surveyor.lastName}`)}
                        className={`flex flex-col items-center py-3 rounded-lg transition-colors font-medium ${
                          surveyor.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={surveyor.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {surveyor.status === 'active' ? (
                          <FaToggleOn className="w-5 h-5 mb-1" />
                        ) : (
                          <FaToggleOff className="w-5 h-5 mb-1" />
                        )}
                        <span className="text-xs">
                          {surveyor.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </button>

                      <button
                        onClick={() => deleteSurveyor(surveyor.id, `${surveyor.firstName} ${surveyor.lastName}`)}
                        className="flex flex-col items-center py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        title="Delete Surveyor"
                      >
                        <FaTrash className="w-5 h-5 mb-1" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../../components/AdminNavbar';
// import { FaUserTie, FaEnvelope, FaPhone, FaUser, FaVenusMars, FaMapMarkerAlt, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

// export default function Surveyors() {
//   const [surveyors, setSurveyors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0
//   });

//   useEffect(() => {
//     fetchSurveyors();
//   }, []);

//   const fetchSurveyors = async () => {
//     try {
//       const res = await axios.get('${API_BASE_URL}/admin/users');
//       const allUsers = Object.values(res.data).flat();
//       const surveyorList = allUsers.filter(u => u.role === 'SURVEYOR');
//       setSurveyors(surveyorList);
      
//       // Calculate stats
//       setStats({
//         total: surveyorList.length,
//         active: surveyorList.filter(s => s.status !== 'inactive').length,
//         inactive: surveyorList.filter(s => s.status === 'inactive').length
//       });
      
//       setLoading(false);
//     } catch (err) {
//       console.error('Failed to fetch surveyors:', err);
//       setLoading(false);
//     }
//   };

//   const handleEdit = (surveyor) => {
//     setEditingId(surveyor.id);
//     setEditForm({
//       firstName: surveyor.firstName,
//       lastName: surveyor.lastName,
//       email: surveyor.email,
//       contactNo: surveyor.contactNo || '',
//       age: surveyor.age || '',
//       gender: surveyor.gender || 'Male',
//       street: surveyor.street || '',
//       city: surveyor.city || '',
//       pincode: surveyor.pincode || ''
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`${API_BASE_URL}/admin/users/${editingId}`, editForm);
//       setEditingId(null);
//       fetchSurveyors();
//     } catch (err) {
//       alert('Error updating surveyor. Please try again.');
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Are you sure you want to delete surveyor "${name}"? This action cannot be undone.`)) {
//       try {
//         await axios.delete(`${API_BASE_URL}/admin/users/${id}`);
//         fetchSurveyors();
//       } catch (err) {
//         alert('Error deleting surveyor. Please try again.');
//       }
//     }
//   };

//   const toggleStatus = async (id, currentStatus, name) => {
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//     if (window.confirm(`Change surveyor "${name}" status to ${newStatus}?`)) {
//       try {
//         await axios.put(`${API_BASE_URL}/admin/users/${id}/status`, { status: newStatus });
//         fetchSurveyors();
//       } catch (err) {
//         alert('Error updating status. Please try again.');
//       }
//     }
//   };

//   const filteredSurveyors = surveyors.filter(surveyor =>
//     !searchQuery ||
//     surveyor.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     surveyor.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     surveyor.email?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <AdminNavbar />
//         <div className="container-padding py-8 pt-24">
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//             <p className="mt-4 text-gray-500">Loading surveyors...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminNavbar />
      
//       <div className="container-padding py-8 pt-24">
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Surveyor Management</h1>
//           <p className="text-gray-600">Manage all surveyor accounts in the system</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
//             <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
//             <div className="text-sm font-medium text-gray-700">Total Surveyors</div>
//           </div>
//           <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
//             <div className="text-3xl font-bold text-gray-900 mb-2">{stats.active}</div>
//             <div className="text-sm font-medium text-gray-700">Active Surveyors</div>
//           </div>
//           <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
//             <div className="text-3xl font-bold text-gray-900 mb-2">{stats.inactive}</div>
//             <div className="text-sm font-medium text-gray-700">Inactive Surveyors</div>
//           </div>
//         </div>

//         {/* Search and Actions */}
//         <div className="glass-card rounded-xl p-6 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search surveyors by name or email..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   🔍
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={fetchSurveyors}
//                 className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//               >
//                 Refresh
//               </button>
//               <a
//                 href="/admin/register-surveyor"
//                 className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
//               >
//                 + Add Surveyor
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Surveyors Grid/Table */}
//         {filteredSurveyors.length === 0 ? (
//           <div className="glass-card rounded-xl p-12 text-center">
//             <div className="text-gray-400 text-6xl mb-4">👷</div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No surveyors found</h3>
//             <p className="text-gray-600 mb-6">
//               {searchQuery ? 'Try adjusting your search criteria' : 'No surveyors have been registered yet'}
//             </p>
//             <a
//               href="/admin/register-surveyor"
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all"
//             >
//               <FaUserTie className="mr-2" />
//               Register First Surveyor
//             </a>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredSurveyors.map(surveyor => (
//               <div key={surveyor.id} className="glass-card rounded-xl p-6 card-hover">
//                 {/* Edit Mode */}
//                 {editingId === surveyor.id ? (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="font-bold text-gray-900">Edit Surveyor</h3>
//                       <button
//                         onClick={() => setEditingId(null)}
//                         className="text-gray-400 hover:text-gray-600"
//                       >
//                         <FaTimes />
//                       </button>
//                     </div>
                    
//                     <div className="space-y-3">
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           value={editForm.firstName}
//                           onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
//                           className="input-field text-sm"
//                           placeholder="First Name"
//                         />
//                         <input
//                           value={editForm.lastName}
//                           onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
//                           className="input-field text-sm"
//                           placeholder="Last Name"
//                         />
//                       </div>
                      
//                       <input
//                         value={editForm.email}
//                         onChange={(e) => setEditForm({...editForm, email: e.target.value})}
//                         className="input-field text-sm"
//                         placeholder="Email"
//                       />
                      
//                       <input
//                         value={editForm.contactNo}
//                         onChange={(e) => setEditForm({...editForm, contactNo: e.target.value})}
//                         className="input-field text-sm"
//                         placeholder="Phone Number"
//                       />
                      
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           value={editForm.age}
//                           onChange={(e) => setEditForm({...editForm, age: e.target.value})}
//                           className="input-field text-sm"
//                           placeholder="Age"
//                         />
//                         <select
//                           value={editForm.gender}
//                           onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
//                           className="input-field text-sm"
//                         >
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-2 pt-4 border-t border-gray-200">
//                       <button
//                         onClick={handleUpdate}
//                         className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
//                       >
//                         <FaSave className="mr-1" />
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={() => setEditingId(null)}
//                         className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   /* View Mode */
//                   <>
//                     {/* Header with Avatar and Status */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full flex items-center justify-center">
//                           <FaUserTie className="text-white" />
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-gray-900">
//                             {surveyor.firstName} {surveyor.lastName}
//                           </h3>
//                           <div className="flex items-center space-x-2 mt-1">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               surveyor.status === 'active' 
//                                 ? 'bg-emerald-100 text-emerald-800' 
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {surveyor.status || 'active'}
//                             </span>
//                             <span className="text-xs text-gray-500">ID: {surveyor.id}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Contact Information */}
//                     <div className="space-y-3 mb-6">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <FaEnvelope className="mr-2 text-gray-400" />
//                         <span className="truncate">{surveyor.email}</span>
//                       </div>
                      
//                       {surveyor.contactNo && (
//                         <div className="flex items-center text-sm text-gray-600">
//                           <FaPhone className="mr-2 text-gray-400" />
//                           <span>{surveyor.contactNo}</span>
//                         </div>
//                       )}
                      
//                       {(surveyor.age || surveyor.gender) && (
//                         <div className="flex items-center space-x-4 text-sm text-gray-600">
//                           {surveyor.age && (
//                             <div className="flex items-center">
//                               <FaUser className="mr-1 text-gray-400" />
//                               <span>{surveyor.age} years</span>
//                             </div>
//                           )}
//                           {surveyor.gender && (
//                             <div className="flex items-center">
//                               <FaVenusMars className="mr-1 text-gray-400" />
//                               <span>{surveyor.gender}</span>
//                             </div>
//                           )}
//                         </div>
//                       )}
                      
//                       {(surveyor.city || surveyor.pincode) && (
//                         <div className="flex items-center text-sm text-gray-600">
//                           <FaMapMarkerAlt className="mr-2 text-gray-400" />
//                           <span className="truncate">
//                             {surveyor.city}{surveyor.pincode ? ` - ${surveyor.pincode}` : ''}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex space-x-2 pt-4 border-t border-gray-200">
//                       <button
//                         onClick={() => handleEdit(surveyor)}
//                         className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
//                       >
//                         <FaEdit className="mr-1" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => toggleStatus(surveyor.id, surveyor.status || 'active', `${surveyor.firstName} ${surveyor.lastName}`)}
//                         className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                           surveyor.status === 'active'
//                             ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
//                         }`}
//                       >
//                         {surveyor.status === 'active' ? 'Deactivate' : 'Activate'}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(surveyor.id, `${surveyor.firstName} ${surveyor.lastName}`)}
//                         className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Footer Stats */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <div className="flex items-center justify-between text-sm text-gray-500">
//             <div>
//               Showing <span className="font-medium">{filteredSurveyors.length}</span> of{' '}
//               <span className="font-medium">{surveyors.length}</span> surveyors
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="flex items-center">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
//                 <span>Active</span>
//               </span>
//               <span className="flex items-center">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
//                 <span>Inactive</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }