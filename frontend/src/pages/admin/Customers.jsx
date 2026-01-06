import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaEye
} from 'react-icons/fa';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/admin/users');
      const allUsers = Array.isArray(res.data) ? res.data : Object.values(res.data).flat();
      const customerList = allUsers.filter(u => u.role === 'USER');
      setCustomers(customerList);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      contactNo: customer.contactNo || '',
      age: customer.age || '',
      gender: customer.gender || 'Male',
      street: customer.street || '',
      city: customer.city || '',
      pincode: customer.pincode || ''
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
      await axios.put(`http://localhost:8080/admin/users/${editingId}`, editForm);
      alert('Customer updated successfully!');
      cancelEdit();
      fetchCustomers(); // Refresh list
    } catch (err) {
      console.error('Update failed:', err.response || err);
      alert('Failed to update customer: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteCustomer = async (id, name) => {
    if (window.confirm(`Permanently delete customer "${name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:8080/admin/users/${id}`);
        alert('Customer deleted successfully');
        fetchCustomers(); // Refresh list
      } catch (err) {
        console.error('Delete failed:', err.response || err);
        alert('Failed to delete customer: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredCustomers = customers.filter(c =>
    searchQuery === '' ||
    `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AdminNavbar />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading customers...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-2">View, edit, and delete customer accounts</p>
        </div>

        {/* Search */}
        <div className="max-w-md mb-8 ">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-3 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>
        </div>

        {/* Customers Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <FaUser className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Customers Found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {customer.firstName?.[0]}{customer.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {customer.id}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Form or Details */}
                {editingId === customer.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="First Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      value={editForm.contactNo}
                      onChange={(e) => setEditForm({ ...editForm, contactNo: e.target.value })}
                      placeholder="Phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="flex-1 flex items-center justify-center gap-2 bg-green-300 text-white py-2.5 rounded-lg hover:bg-green-500 font-medium"
                      >
                        <FaSave />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-300 text-white py-2.5 rounded-lg hover:bg-red-500 font-medium"
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
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      {customer.contactNo && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaPhone className="text-gray-400" />
                          <span className="text-sm">{customer.contactNo}</span>
                        </div>
                      )}
                      {(customer.city || customer.pincode) && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span className="text-sm">
                            {customer.city}{customer.pincode ? `, ${customer.pincode}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="flex flex-col items-center py-3 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors font-medium"
                        title="View Details"
                      >
                        <FaEye className="w-5 h-5 mb-1" />
                        <span className="text-xs">View</span>
                      </button>

                      <button
                        onClick={() => startEdit(customer)}
                        className="flex flex-col items-center py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        title="Edit Customer"
                      >
                        <FaEdit className="w-5 h-5 mb-1" />
                        <span className="text-xs">Edit</span>
                      </button>

                      
                      <button
                        onClick={() => deleteCustomer(customer.id, `${customer.firstName} ${customer.lastName}`)}
                        className="flex flex-col items-center py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        title="Delete Customer"
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

        {/* View Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Customer Profile</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h3>
                    <p className="text-gray-600 mt-1">Customer ID: {selectedCustomer.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="text-lg font-medium text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedCustomer.contactNo || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedCustomer.age || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Gender</p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedCustomer.gender || 'Not provided'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Full Address</p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedCustomer.street ? `${selectedCustomer.street}, ` : ''}
                      {selectedCustomer.city ? `${selectedCustomer.city}, ` : ''}
                      {selectedCustomer.pincode || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Close Profile
                  </button>

                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../../components/AdminNavbar';

// export default function Customers() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get('http://localhost:8080/admin/users');
//       const allUsers = Object.values(res.data).flat();
//       const userCustomers = allUsers.filter(u => u.role === 'USER');
//       setCustomers(userCustomers);
//     } catch (err) {
//       console.error('Failed to fetch customers:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredCustomers = customers.filter(customer => 
//     !searchQuery ||
//     customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const getCustomerStats = () => {
//     return {
//       total: customers.length,
//       active: customers.length, // You can add active status if available
//       recent: customers.filter(c => {
//         const createdDate = new Date(c.createdAt || new Date());
//         const weekAgo = new Date();
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         return createdDate > weekAgo;
//       }).length
//     };
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminNavbar />
      
//       <div className="container-padding py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
//           <p className="text-gray-600 mt-2">Manage all registered customer accounts</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <StatCard 
//             title="Total Customers" 
//             value={getCustomerStats().total} 
//             color="blue"
//             icon="👥"
//           />
//           <StatCard 
//             title="Active Customers" 
//             value={getCustomerStats().active} 
//             color="emerald"
//             icon="✅"
//           />
//           <StatCard 
//             title="New (Last 7 days)" 
//             value={getCustomerStats().recent} 
//             color="purple"
//             icon="🆕"
//           />
//         </div>

//         {/* Search and Actions */}
//         <div className="glass-card rounded-xl p-6 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search customers by name or email..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   🔍
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={fetchCustomers}
//                 className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//               >
//                 Refresh
//               </button>
//               <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
//                 Export CSV
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Customers Table */}
//         <div className="glass-card rounded-xl overflow-hidden">
//           {loading ? (
//             <div className="p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-4 text-gray-500">Loading customers...</p>
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="text-gray-400 text-4xl mb-4">👤</div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
//               <p className="text-gray-500">Try adjusting your search criteria</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact Information
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Personal Details
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Registration Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredCustomers.map((customer) => (
//                     <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
//                             <span className="text-white font-semibold">
//                               {customer.firstName?.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900">
//                               {customer.firstName} {customer.lastName}
//                             </div>
//                             <div className="text-sm text-gray-500">ID: {customer.id}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="text-sm text-gray-900">{customer.email}</div>
//                           <div className="text-sm text-gray-500">{customer.contactNo || 'No phone number'}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="text-sm text-gray-900">
//                             Age: <span className="font-medium">{customer.age || 'N/A'}</span>
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Gender: <span className="font-medium">{customer.gender || 'N/A'}</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
//                             View
//                           </button>
//                           <button className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
//                             Edit
//                           </button>
//                           <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
//                             Deactivate
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, color, icon }) {
//   const colorClasses = {
//     blue: 'bg-blue-50 border-blue-200 text-blue-700',
//     emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
//     purple: 'bg-purple-50 border-purple-200 text-purple-700'
//   };

//   return (
//     <div className={`p-5 rounded-xl border ${colorClasses[color]}`}>
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-2xl">{icon}</div>
//       </div>
//       <div className="text-2xl font-bold">{value}</div>
//       <div className="text-sm font-medium mt-1">{title}</div>
//     </div>
//   );
// }