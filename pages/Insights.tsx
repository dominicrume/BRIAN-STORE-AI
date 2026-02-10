import React, { useContext } from 'react';
import { StoreContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

const Insights: React.FC = () => {
  const { staffMetrics, sales } = useContext(StoreContext);

  // Prepare Chart Data
  const salesData = [
    { name: 'Mon', sales: 120 },
    { name: 'Tue', sales: 145 },
    { name: 'Wed', sales: 100 },
    { name: 'Thu', sales: 180 },
    { name: 'Fri', sales: 250 },
    { name: 'Sat', sales: 310 },
    { name: 'Sun', sales: 190 },
  ];

  return (
    <div className="space-y-8 md:ml-64">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Performance & Risk</h2>
            <p className="text-slate-500">Deep dive into what Brian is seeing.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-500">
            <CheckCircle2 size={14} className="text-green-500"/> QuickBooks Synced
        </div>
      </div>

      {/* Sales Forecast Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20}/> Weekly Revenue Trend
            </h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">On Track</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Risk Matrix (Heatmap style list) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={20} /> Staff Risk Matrix
            </h3>
            <p className="text-xs text-slate-500 mb-4">AI analysis based on voided transactions and cash discrepancies.</p>
            
            <div className="space-y-4">
                {staffMetrics.map((staff, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {staff.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="font-medium text-slate-800">{staff.name}</span>
                                <span className={`text-xs font-bold ${staff.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                    {staff.riskScore > 50 ? 'High Risk' : 'Low Risk'} ({staff.riskScore}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full ${staff.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${staff.riskScore}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Shift: {staff.shift} • Voids: {staff.voidedTransactions}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Demand Forecasting Text */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-lg mb-4">Brian's Forecast</h3>
            <div className="space-y-6">
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Coming Spike</p>
                    <p className="font-medium">Demand for <span className="text-blue-400">Beverages</span> expected to rise <span className="text-green-400">+40%</span> this weekend due to projected hot weather.</p>
                </div>
                <div className="h-px bg-slate-700"></div>
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Dead Stock Warning</p>
                    <p className="font-medium"><span className="text-red-400">Guinness Stout</span> has not moved in 14 days. Consider a "Buy 2 Get 1 Free" promo to recover cash flow.</p>
                </div>
            </div>
            <button className="w-full mt-6 py-3 bg-blue-600 rounded-lg font-bold text-sm hover:bg-blue-500 transition-colors">
                Generate Restock List
            </button>
        </div>
      </div>
    </div>
  );
};

export default Insights;