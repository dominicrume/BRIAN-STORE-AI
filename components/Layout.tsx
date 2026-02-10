import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Package, Bot, Bell, ShieldCheck, Settings as SettingsIcon } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/pos': return 'Point of Sale';
      case '/inventory': return 'Inventory';
      case '/insights': return 'Performance';
      case '/ai': return 'Brian AI';
      case '/settings': return 'Settings';
      default: return 'Brian Store AI';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Header - Mobile Optimized */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            B
          </div>
          <div className="flex flex-col">
            {/* Dynamic Title for clearer Mobile Context */}
            <h1 className="text-lg font-bold text-slate-900 leading-none md:hidden">{getPageTitle()}</h1>
            <h1 className="hidden md:block text-xl font-bold text-slate-900 tracking-tight leading-none">Brian Store AI</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden md:block">RUN YOUR STORE. ANYWHERE.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => navigate('/settings')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200 transition-colors md:hidden">
              <SettingsIcon size={20} />
            </button>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4 md:px-8 max-w-7xl mx-auto w-full scroll-smooth">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile First - High Touch Targets) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-end h-16 md:hidden z-20 pb-1 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center w-full py-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          {({ isActive }) => (
            <>
              <LayoutDashboard size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Home</span>
            </>
          )}
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `flex flex-col items-center w-full py-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          {({ isActive }) => (
            <>
              <Package size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Stock</span>
            </>
          )}
        </NavLink>
        
        {/* Floating POS Action Button */}
        <div className="relative -top-5">
           <NavLink to="/pos" className={({ isActive }) => `flex flex-col items-center justify-center w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg border-4 border-gray-50 active:scale-95 transition-transform ${isActive ? 'bg-blue-700' : ''}`}>
             <ShoppingCart size={24} />
           </NavLink>
        </div>

        <NavLink to="/insights" className={({ isActive }) => `flex flex-col items-center w-full py-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          {({ isActive }) => (
            <>
              <BarChart3 size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Insights</span>
            </>
          )}
        </NavLink>
        <NavLink to="/ai" className={({ isActive }) => `flex flex-col items-center w-full py-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          {({ isActive }) => (
            <>
              <Bot size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">Brian</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Sidebar for Desktop (Hidden on mobile) */}
      <div className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Package size={20} /> Inventory Brain
          </NavLink>
          <NavLink to="/pos" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <ShoppingCart size={20} /> POS & Sales
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <BarChart3 size={20} /> Risk & Growth
          </NavLink>
          <NavLink to="/ai" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Bot size={20} /> Ask Brian
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <SettingsIcon size={20} /> Settings
          </NavLink>
        </div>
        
        <div onClick={() => navigate('/settings')} className="mt-auto p-4 bg-slate-900 rounded-xl border border-slate-800 text-white relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-green-400"/>
                <h4 className="text-sm font-bold">Enterprise Mode</h4>
             </div>
             <p className="text-xs text-slate-300 mb-3">Sync QuickBooks & Manage Multi-Store.</p>
             <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors">Upgrade Plan</button>
           </div>
           {/* Decorative background element */}
           <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        </div>
      </div>
    </div>
  );
};

export default Layout;