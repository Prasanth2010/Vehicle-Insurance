import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import PolicyCard from '../components/PolicyCard';
import { FaShieldAlt, FaCar, FaCheckCircle, FaClock, FaPhoneAlt, FaMoneyBillWave } from 'react-icons/fa';
import { GiCarKey } from 'react-icons/gi';

export default function Home() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 10000,
    satisfaction: 99,
    claimsProcessed: 5000
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/policies`)
      .then(res => {
        setPolicies(res.data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {user && user.id ? <Navbar /> : <Header />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container-padding relative py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <FaShieldAlt className="text-2xl" />
              <span className="ml-2 font-semibold">Trusted Protection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Secure Your Journey with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                InsurePro
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive vehicle insurance solutions with unmatched coverage, 
              lightning-fast claims, and 24/7 support for complete peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user?.id ? (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <GiCarKey className="text-xl" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Sign In</span>
                    <FaCheckCircle className="text-xl" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/user/dashboard"
                  className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <FaCar className="text-xl" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Policies */}
      <section className="py-20 bg-white">
        <div className="container-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Insurance Plans
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the perfect coverage for your vehicle from our trusted plans
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Loading policies...</p>
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No policies available</h3>
              <p className="text-gray-600">Check back soon for our latest insurance plans</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {policies.map(policy => (
                <div key={policy.id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <PolicyCard policy={policy} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to={user?.id ? "/user/dashboard" : "/login"}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {user?.id ? 'Manage Policies' : 'View All Plans'}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple &amp; Transparent Process
            </h2>
            <p className="text-gray-600 text-lg">
              Get insured in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Choose Your Plan"
              description="Select from our comprehensive insurance plans that match your needs and budget."
              icon="📋"
            />
            <StepCard
              number="2"
              title="Get Instant Quote"
              description="Receive an immediate premium quote with no hidden charges or surprises."
              icon="💳"
            />
            <StepCard
              number="3"
              title="Enjoy Protection"
              description="Start your coverage immediately with 24/7 support and easy claim submission."
              icon="🛡️"
            />
          </div>
        </div>
      </section> */}

     
      {/* Footer Note */}
      {/* <div className="bg-gray-900 text-white py-8">
        <div className="container-padding">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} InsurePro Vehicle Insurance. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Your safety is our priority. Drive with confidence.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  const iconColors = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${iconColors[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 text-3xl">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}