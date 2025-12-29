export default function StatCard({ title, value, color = 'blue', icon, trend, trendValue, loading }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  const trendIcon = trend === 'up' ? '↗' : '↘';

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} card-hover`}>
      <div className="flex items-center justify-between mb-3">
        {icon && <div className="text-2xl">{icon}</div>}
        {trend && (
          <div className={`text-sm font-medium ${trendColor}`}>
            {trendIcon} {trendValue}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold">
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="text-sm font-medium mt-1">{title}</div>
    </div>
  );
}