import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Package, Bot, Bell, ShieldCheck } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            B
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Brian Store AI</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">RUN YOUR STORE. ANYWHERE.</p>
          </div>
        </div>
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4 md:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden z-20">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          <Package size={20} />
          <span className="text-xs mt-1">Stock</span>
        </NavLink>
        <NavLink to="/pos" className={({ isActive }) => `flex flex-col items-center p-2 -mt-6 bg-blue-600 rounded-full text-white shadow-lg border-4 border-gray-50`}>
          <ShoppingCart size={24} />
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Insights</span>
        </NavLink>
        <NavLink to="/ai" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          <Bot size={20} />
          <span className="text-xs mt-1">Brian</span>
        </NavLink>
      </nav>

      {/* Sidebar for Desktop (Hidden on mobile) */}
      <div className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Package size={20} /> Inventory Brain
          </NavLink>
          <NavLink to="/pos" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <ShoppingCart size={20} /> POS & Sales
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <BarChart3 size={20} /> Risk & Growth
          </NavLink>
          <NavLink to="/ai" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Bot size={20} /> Ask Brian
          </NavLink>
        </div>
        
        <div className="mt-auto p-4 bg-slate-900 rounded-xl border border-slate-800 text-white relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-green-400"/>
                <h4 className="text-sm font-bold">Enterprise Mode</h4>
             </div>
             <p className="text-xs text-slate-300 mb-3">Sync QuickBooks & Manage Multi-Store.</p>
             <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors">Upgrade Plan</button>
           </div>
           {/* Decorative background element */}
           <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Layout;