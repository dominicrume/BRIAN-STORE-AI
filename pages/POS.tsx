import React, { useContext, useState } from 'react';
import { StoreContext } from '../App';
import { Product } from '../types';
import { Search, Trash2, CreditCard, Banknote, Smartphone, CheckCircle } from 'lucide-react';

const POS: React.FC = () => {
  const { products, recordSale } = useContext(StoreContext);
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);

  const handleCheckout = (method: 'Cash' | 'Mobile Money' | 'Card') => {
    if (cart.length === 0) return;
    
    recordSale({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      total,
      paymentMethod: method,
      items: cart.map(i => ({ productId: i.product.id, quantity: i.qty }))
    });

    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setCart([]);
    }, 2000);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (success) {
      return (
          <div className="h-full md:ml-64 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sale Recorded!</h2>
              <p className="text-slate-500 mt-2">Inventory updated. Receipt sent.</p>
          </div>
      )
  }

  return (
    <div className="md:ml-64 h-[calc(100vh-80px)] md:h-full flex flex-col md:flex-row gap-6">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">New Sale</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search item..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-100 shadow-sm p-2 grid grid-cols-2 lg:grid-cols-3 gap-2 content-start">
            {filteredProducts.map(product => (
                <button 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="p-3 text-left border border-gray-100 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col h-24 justify-between"
                >
                    <span className="font-medium text-slate-800 line-clamp-2 text-sm">{product.name}</span>
                    <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Cart & Checkout (Sticky on Desktop) */}
      <div className="w-full md:w-96 bg-white border border-gray-200 shadow-xl rounded-t-2xl md:rounded-2xl flex flex-col max-h-[50vh] md:max-h-none">
        <div className="p-4 border-b border-gray-100 bg-slate-50 md:rounded-t-2xl">
            <h3 className="font-bold text-slate-800">Current Order</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">Cart is empty</p>
            ) : (
                cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">{item.qty}</span>
                            <span className="text-slate-800 font-medium truncate max-w-[120px]">{item.product.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-900">${(item.product.price * item.qty).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-gray-200 md:rounded-b-2xl">
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleCheckout('Cash')} disabled={cart.length === 0} className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors disabled:opacity-50">
                    <Banknote size={20} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cash</span>
                </button>
                <button onClick={() => handleCheckout('Mobile Money')} disabled={cart.length === 0} className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors disabled:opacity-50">
                    <Smartphone size={20} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">MoMo</span>
                </button>
                <button onClick={() => handleCheckout('Card')} disabled={cart.length === 0} className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors disabled:opacity-50">
                    <CreditCard size={20} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Card</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
