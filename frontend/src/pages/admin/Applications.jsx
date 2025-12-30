import { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';

export default function Applications() {
  const [applications] = useState([
    { id: 1, name: 'John Doe', policy: 'Comprehensive', date: '2024-01-15', status: 'Pending' },
    { id: 2, name: 'Jane Smith', policy: 'Third Party', date: '2024-01-14', status: 'Approved' },
    { id: 3, name: 'Mike Johnson', policy: 'Comprehensive', date: '2024-01-13', status: 'Rejected' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container-padding py-16 px-8 ">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Applications</h1>
          <p className="text-gray-600">
            Review and manage all policy applications from customers
          </p>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th className="px 6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 text-sm font-semibold">
                            {app.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-500">Customer ID: {app.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.policy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        View Details
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-900">
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coming Soon Note */}
        {/* <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-3 text-xl">🚧</span>
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Feature in Development</h3>
              <p className="text-sm text-yellow-700">
                This page is currently showing mock data. Backend integration for real 
                policy applications is coming soon.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}