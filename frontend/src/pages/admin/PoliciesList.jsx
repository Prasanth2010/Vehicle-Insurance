import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

export default function PoliciesList() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/policies')
      .then(res => setPolicies(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h1 className="text-6xl font-bold text-lime-400 text-center mb-16">All Policies</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {policies.map(policy => (
            <div key={policy.id} className="bg-gray-900 p-10 rounded-3xl border-4 border-lime-400">
              <h3 className="text-3xl font-bold text-lime-400 mb-4">{policy.name}</h3>
              <p className="text-xl mb-4">{policy.description}</p>
              <p className="text-xl">Plan: <span className="text-lime-400">{policy.plan}</span></p>
              <p className="text-xl">Premium: <span className="text-lime-400">₹{policy.premiumAmount}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}