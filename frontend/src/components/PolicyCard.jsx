import { FaShieldAlt, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function PolicyCard({ policy }) {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center mb-2">
            <FaShieldAlt className="text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">{policy.name}</h3>
          </div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
            {policy.plan}
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-600 flex items-center">
          <FaRupeeSign className="text-lg" />
          {policy.premiumAmount}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
        {policy.description}
      </p>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <FaCalendarAlt className="mr-2" />
        <span>{policy.plan === 'Yearly' ? 'Annual premium' : 'Monthly premium'}</span>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          to="/login"
          className="w-full btn-primary py-2.5 text-sm flex items-center justify-center"
        >
          View Details
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}