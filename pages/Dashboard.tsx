import React, { useContext, useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Users, DollarSign, ArrowRight, Shield } from 'lucide-react';
import { StoreContext } from '../App';
import { analyzeStoreHealth } from '../services/geminiService';

const MetricCard: React.FC<{ title: string; value: string; trend?: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {trend && <p className="text-green-600 text-xs font-medium mt-1 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { sales, alerts, products, staffMetrics } = useContext(StoreContext);
  const [aiSummary, setAiSummary] = useState<string>("Brian is analyzing your store data...");
  
  // Calculate today's sales
  const todaySales = sales
    .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.total, 0);

  const criticalStock = products.filter(p => p.stock <= p.minStock).length;
  const highRiskStaff = staffMetrics.filter(s => s.riskScore > 50).length;

  useEffect(() => {
    // Simulate AI loading on mount
    analyzeStoreHealth(products, staffMetrics).then(setAiSummary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good Morning, Chief.</h2>
          <p className="text-slate-500">Brian is monitoring 3 key areas for you today.</p>
        </div>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-green-100">
          <Shield size={16} />
          <span>Protected by Brian AI</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Today's Sales" 
          value={`$${todaySales.toFixed(2)}`} 
          trend="+12% vs yesterday" 
          icon={<DollarSign size={20} />} 
          color="bg-green-600" 
        />
        <MetricCard 
          title="Stock Critical" 
          value={`${criticalStock} Items`} 
          trend="Needs Restock" 
          icon={<AlertTriangle size={20} />} 
          color="bg-orange-500" 
        />
        <MetricCard 
          title="Staff Risk Level" 
          value={`${highRiskStaff} Alerts`} 
          trend="Behavior detected"
          icon={<Users size={20} />} 
          color="bg-red-500" 
        />
        <MetricCard 
          title="Est. Profit" 
          value="$145.20" 
          trend="Projected today" 
          icon={<TrendingUp size={20} />} 
          color="bg-blue-600" 
        />
      </div>

      {/* AI Summary Section */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                    B
                </div>
                <h3 className="font-semibold text-lg">Daily Executive Brief</h3>
            </div>
            <div className="space-y-2 text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line pl-1 border-l-2 border-blue-500">
                {aiSummary}
            </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-slate-800">Real-time Watchtower</h3>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">View All <ArrowRight size={16}/></button>
        </div>
        <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className={`mt-1 w-2 h-2 rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500 animate-pulse' : alert.type === 'WARNING' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{alert.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{alert.timestamp} • {alert.category}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;