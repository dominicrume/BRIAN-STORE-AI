import React, { useContext, useState } from 'react';
import { StoreContext } from '../App';
import { ShieldCheck, CheckCircle2, CreditCard, Banknote, RefreshCw, AlertCircle, Lock } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings, resetData } = useContext(StoreContext);
  const [connectingQB, setConnectingQB] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  const handleConnectQuickBooks = () => {
    setConnectingQB(true);
    // Simulate API delay
    setTimeout(() => {
      updateSettings({ quickBooksConnected: true, isEnterprise: true });
      setConnectingQB(false);
    }, 2000);
  };

  const handleDisconnectQuickBooks = () => {
    if (confirm("Disconnect QuickBooks? Financial data syncing will stop.")) {
        updateSettings({ quickBooksConnected: false });
    }
  };

  const handleConnectPaymentProcessor = () => {
      setSavingPayment(true);
      setTimeout(() => {
          updateSettings({ paymentProcessorConnected: true });
          setSavingPayment(false);
      }, 1500);
  }

  return (
    <div className="space-y-6 md:ml-64 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Store Settings</h2>
          <p className="text-slate-500">Manage integrations, payments, and enterprise features.</p>
        </div>
        {settings.isEnterprise && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-100">
                <ShieldCheck size={16} /> Enterprise Active
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Enterprise Plan Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <ShieldCheck size={24} className="text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Enterprise Mode</h3>
                        <p className="text-slate-400 text-sm">{settings.isEnterprise ? "Plan Active" : "Current Plan: Free Starter"}</p>
                    </div>
                </div>
                
                <ul className="space-y-3 mb-6 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Multi-Store Dashboard</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Unlimited AI Queries</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Priority Support</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Advanced Audit Logs</li>
                </ul>

                {!settings.isEnterprise ? (
                    <button onClick={() => updateSettings({ isEnterprise: true })} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors shadow-lg">
                        Upgrade to Enterprise ($49/mo)
                    </button>
                ) : (
                    <button className="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-bold cursor-default border border-slate-600">
                        Plan Active • Renews Next Month
                    </button>
                )}
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Accounting Integration */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                    <Banknote size={24} className="text-green-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Accounting & Finance</h3>
                    <p className="text-slate-500 text-sm">Sync sales directly to your books.</p>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/QuickBooks.svg/2560px-QuickBooks.svg.png" alt="QuickBooks" className="h-6 object-contain opacity-80" />
                </div>
                {settings.quickBooksConnected ? (
                    <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle2 size={12}/> Connected</span>
                         <button onClick={handleDisconnectQuickBooks} className="text-xs text-slate-400 hover:text-red-500 underline">Disconnect</button>
                    </div>
                ) : (
                    <button 
                        onClick={handleConnectQuickBooks}
                        disabled={connectingQB}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {connectingQB ? <RefreshCw size={14} className="animate-spin" /> : "Connect"}
                    </button>
                )}
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1">
                <Lock size={12} /> Data is encrypted bank-grade security.
            </p>
        </div>

        {/* Payment Processors */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                    <CreditCard size={24} className="text-purple-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Payment Processors</h3>
                    <p className="text-slate-500 text-sm">Accept Card and Mobile Money payments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-800 mb-2">Stripe / Card Payments</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">Public Key</label>
                            <input type="text" placeholder="pk_test_..." className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 ring-blue-100 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">Secret Key</label>
                            <input type="password" placeholder="sk_test_..." className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 ring-blue-100 outline-none" />
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-800 mb-2">Mobile Money (M-Pesa / MTN)</h4>
                    <div className="space-y-3">
                         <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">Merchant ID</label>
                            <input type="text" placeholder="123456" className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 ring-blue-100 outline-none" />
                        </div>
                         <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">API Passkey</label>
                            <input type="password" placeholder="••••••••" className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 ring-blue-100 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleConnectPaymentProcessor}
                    disabled={savingPayment}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-70 flex items-center gap-2"
                >
                    {savingPayment ? (
                        <>Saving Configuration...</>
                    ) : (
                        <>Save Payment Settings</>
                    )}
                </button>
            </div>
            {settings.paymentProcessorConnected && !savingPayment && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={16} /> Payment Gateway Connected Successfully.
                </div>
            )}
        </div>

         <div className="lg:col-span-2 flex justify-center pt-8">
             <button onClick={resetData} className="text-red-500 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
                 <AlertCircle size={16} /> Reset App Data
             </button>
         </div>

      </div>
    </div>
  );
};

export default Settings;