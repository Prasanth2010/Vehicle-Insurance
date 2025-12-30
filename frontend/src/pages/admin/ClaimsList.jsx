
//grok

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

export default function ClaimsList() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/admin/claims').then(res => setClaims(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:8080/admin/claims/${id}/status`, { status });
    setClaims(claims.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h1 className="text-6xl font-bold text-lime-400 text-center mb-16">All Claims</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {claims.map(claim => (
            <div key={claim.id} className="bg-gray-900 p-10 rounded-3xl border-4 border-lime-400">
              <p className="text-2xl font-bold text-lime-400 mb-4">{claim.policy?.name}</p>
              <p>User: {claim.user?.firstName} {claim.user?.lastName}</p>
              <p>Description: {claim.description}</p>
              <p className="mt-4">Status:
                <select value={claim.status} onChange={(e) => updateStatus(claim.id, e.target.value)} className="ml-4 p-2 bg-black border border-lime-400 rounded">
                  <option>PENDING</option>
                  <option>APPROVED</option>
                  <option>REJECTED</option>
                </select>
              </p>
              {claim.damagePhotoPath && <img src={`http://localhost:8080${claim.damagePhotoPath}`} alt="Damage" className="mt-6 w-full rounded-xl" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}   