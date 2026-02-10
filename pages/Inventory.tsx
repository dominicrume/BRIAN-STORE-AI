import React, { useContext, useState } from 'react';
import { Search, Plus, Filter, MessageSquare, AlertCircle } from 'lucide-react';
import { StoreContext } from '../App';
import { generateMarketingMessage } from '../services/geminiService';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const { products } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [marketingMsg, setMarketingMsg] = useState<{id: string, msg: string} | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePromo = async (product: Product) => {
    setGeneratingFor(product.id);
    const msg = await generateMarketingMessage(product);
    setMarketingMsg({ id: product.id, msg });
    setGeneratingFor(null);
  };

  return (
    <div className="space-y-6 md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory Brain</h2>
          <p className="text-slate-500 text-sm">Real-time tracking. No more guessing.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:bg-blue-700 active:scale-95 transition-all">
          <Plus size={18} /> Add Stock
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, barcode or category..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-slate-600">
          <Filter size={20} />
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-100">
          {filteredProducts.map(product => {
            const isLowStock = product.stock <= product.minStock;
            return (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">Cost: ${product.cost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock} Units Left
                    </div>
                    {isLowStock && (
                      <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                        <AlertCircle size={12} /> Low Stock
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                     <button 
                        onClick={() => handleGeneratePromo(product)}
                        disabled={generatingFor === product.id}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 text-xs font-medium border border-transparent hover:border-blue-100 transition-all"
                     >
                        {generatingFor === product.id ? (
                           <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                        ) : (
                           <MessageSquare size={16} />
                        )}
                        Ask Brian
                     </button>
                  </div>
                </div>

                {/* AI Promo Result */}
                {marketingMsg?.id === product.id && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-lg relative">
                        <p className="text-sm text-blue-900 italic">"{marketingMsg.msg}"</p>
                        <div className="mt-2 flex gap-2">
                            <button className="text-xs bg-white border border-blue-200 px-2 py-1 rounded text-blue-700 hover:bg-blue-100 font-medium">Copy for WhatsApp</button>
                            <button onClick={() => setMarketingMsg(null)} className="text-xs text-blue-400 hover:text-blue-600 px-2 py-1">Dismiss</button>
                        </div>
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inventory;