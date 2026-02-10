import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../App';
import { Product } from '../types';
import { Search, Trash2, CreditCard, Banknote, Smartphone, CheckCircle, AlertOctagon } from 'lucide-react';

const POS: React.FC = () => {
  const { products, recordSale } = useContext(StoreContext);
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewState, setViewState] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  // SOUND EFFECT FOR SCANNERS (Future implementation placeholder)
  const playBeep = () => {}; 

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      setErrorMessage(`${product.name} is out of stock!`);
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      
      // Check stock limit for current cart addition
      if (existing && existing.qty + 1 > product.stock) {
        setErrorMessage(`Only ${product.stock} units available.`);
        setTimeout(() => setErrorMessage(''), 2000);
        return prev;
      }

      playBeep();
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.qty + delta;
        if (newQty <= 0) return item; // Don't remove, just stop
        if (newQty > item.product.stock) {
           setErrorMessage("Max stock reached");
           setTimeout(() => setErrorMessage(''), 1000);
           return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // Math safety: rounding to 2 decimals for currency
  const total = parseFloat(cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0).toFixed(2));

  const handleCheckout = (method: 'Cash' | 'Mobile Money' | 'Card') => {
    if (cart.length === 0) return;
    
    const success = recordSale({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      total,
      paymentMethod: method,
      items: cart.map(i => ({ 
        productId: i.product.id, 
        quantity: i.qty,
        name: i.product.name, // Snapshot name
        price: i.product.price // Snapshot price
      })),
      status: 'COMPLETED'
    });

    if (success) {
      setViewState('SUCCESS');
      setTimeout(() => {
          setViewState('IDLE');
          setCart([]);
      }, 2000);
    } else {
      setViewState('ERROR');
      setErrorMessage("Transaction Failed. Check Stock.");
      setTimeout(() => setViewState('IDLE'), 3000);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (viewState === 'SUCCESS') {
      return (
          <div className="h-full md:ml-64 flex flex-col items-center justify-center text-center p-6 bg-green-50 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Sale Recorded</h2>
              <p className="text-slate-600 mt-2 text-lg">Inventory updated instantly.</p>
              <p className="text-slate-400 mt-8 text-sm">Redirecting to register...</p>
          </div>
      )
  }

  return (
    <div className="md:ml-64 h-[calc(100vh-140px)] md:h-full flex flex-col md:flex-row gap-4 md:gap-6 relative">
      
      {/* Toast Error */}
      {errorMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 animate-bounce">
          <AlertOctagon size={20} /> {errorMessage}
        </div>
      )}

      {/* Product Grid (Left/Top) */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Register</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search product..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-100 shadow-sm p-2 grid grid-cols-2 lg:grid-cols-3 gap-2 content-start pb-20 md:pb-2">
            {filteredProducts.map(product => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <button 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className={`p-3 text-left border rounded-lg transition-all flex flex-col h-28 justify-between relative overflow-hidden group
                        ${isOutOfStock ? 'bg-gray-100 border-gray-100 opacity-60 cursor-not-allowed' : 'bg-white border-gray-100 hover:border-blue-500 hover:shadow-md active:bg-blue-50'}
                      `}
                  >
                      <div>
                        <span className="font-medium text-slate-800 line-clamp-2 leading-tight">{product.name}</span>
                        <span className="text-xs text-slate-500 mt-1 block">{product.stock} left</span>
                      </div>
                      <span className="font-bold text-blue-600 text-lg">${product.price.toFixed(2)}</span>
                      
                      {/* Touch Ripple Effect Target */}
                      {!isOutOfStock && <div className="absolute inset-0 bg-blue-500 opacity-0 group-active:opacity-10 transition-opacity" />}
                  </button>
                )
            })}
        </div>
      </div>

      {/* Cart (Right/Bottom) */}
      <div className="w-full md:w-96 bg-white border-t md:border border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:shadow-xl rounded-t-2xl md:rounded-2xl flex flex-col fixed md:relative bottom-16 md:bottom-0 left-0 h-[45vh] md:h-auto z-10">
        <div className="p-3 border-b border-gray-100 bg-slate-50 md:rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Current Order ({cart.reduce((a,c) => a + c.qty, 0)})</h3>
            <button onClick={() => setCart([])} className="text-xs text-red-500 font-medium px-2 py-1 hover:bg-red-50 rounded">Clear</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                   <CreditCard size={48} strokeWidth={1} />
                   <p className="text-sm font-medium">Cart is empty</p>
                </div>
            ) : (
                cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                        <div className="flex-1 min-w-0 pr-2">
                           <div className="font-medium text-slate-800 truncate text-sm">{item.product.name}</div>
                           <div className="text-xs text-slate-500">${item.product.price.toFixed(2)} / unit</div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button onClick={() => updateQty(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-gray-200 active:scale-95 text-slate-700 font-bold">-</button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-gray-200 active:scale-95 text-blue-600 font-bold">+</button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.product.id)} className="ml-2 text-slate-300 hover:text-red-500 p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))
            )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-gray-200 md:rounded-b-2xl pb-6 md:pb-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">Total Due</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">${total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 h-14">
                <button onClick={() => handleCheckout('Cash')} disabled={cart.length === 0} className="flex flex-col items-center justify-center bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 shadow-sm active:scale-95">
                    <Banknote size={20} className="mb-0.5" />
                    <span className="text-[10px] font-bold uppercase">Cash</span>
                </button>
                <button onClick={() => handleCheckout('Mobile Money')} disabled={cart.length === 0} className="flex flex-col items-center justify-center bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 shadow-sm active:scale-95">
                    <Smartphone size={20} className="mb-0.5" />
                    <span className="text-[10px] font-bold uppercase">MoMo</span>
                </button>
                <button onClick={() => handleCheckout('Card')} disabled={cart.length === 0} className="flex flex-col items-center justify-center bg-slate-800 rounded-lg text-white hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:bg-slate-300 shadow-sm active:scale-95">
                    <CreditCard size={20} className="mb-0.5" />
                    <span className="text-[10px] font-bold uppercase">Card</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default POS;