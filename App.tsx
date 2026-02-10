import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Insights from './pages/Insights';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';
import { Product, Sale, Alert, StaffMetric, StoreContextType, StoreSettings } from './types';
import { MOCK_PRODUCTS, MOCK_SALES, MOCK_ALERTS, MOCK_STAFF } from './constants';
import { analyzeStoreHealth } from './services/geminiService';

const DEFAULT_SETTINGS: StoreSettings = {
  isEnterprise: false,
  quickBooksConnected: false,
  paymentProcessorConnected: false,
  currency: 'USD',
  storeName: 'My Store'
};

export const StoreContext = React.createContext<StoreContextType>({
  products: [],
  sales: [],
  alerts: [],
  staffMetrics: [],
  settings: DEFAULT_SETTINGS,
  addProduct: () => {},
  recordSale: () => false,
  refreshAIInsights: async () => "",
  resetData: () => {},
  updateSettings: () => {},
});

const App: React.FC = () => {
  // OFFLINE-FIRST STRATEGY: Load from LocalStorage or fall back to MOCK
  const loadInitialState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error("Storage load error", e);
      return fallback;
    }
  };

  const [products, setProducts] = useState<Product[]>(() => loadInitialState('products', MOCK_PRODUCTS));
  const [sales, setSales] = useState<Sale[]>(() => loadInitialState('sales', MOCK_SALES));
  const [alerts, setAlerts] = useState<Alert[]>(() => loadInitialState('alerts', MOCK_ALERTS));
  const [staffMetrics, setStaffMetrics] = useState<StaffMetric[]>(() => loadInitialState('staff', MOCK_STAFF));
  const [settings, setSettings] = useState<StoreSettings>(() => loadInitialState('settings', DEFAULT_SETTINGS));

  // PERSISTENCE EFFECT
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('alerts', JSON.stringify(alerts));
    localStorage.setItem('staff', JSON.stringify(staffMetrics));
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [products, sales, alerts, staffMetrics, settings]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const recordSale = (sale: Sale): boolean => {
    // 1. STOCK VALIDATION (Critical Logic Rule)
    // Check if we have enough stock for ALL items before processing anything
    for (const item of sale.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) return false; // Product not found
      if (product.stock < item.quantity) return false; // Insufficient stock
    }

    // 2. PROCESS SALE
    setSales(prev => [sale, ...prev]);

    // 3. UPDATE INVENTORY
    setProducts(prevProducts => {
      const newProducts = prevProducts.map(p => {
        const saleItem = sale.items.find(i => i.productId === p.id);
        if (saleItem) {
          return {
            ...p,
            stock: p.stock - saleItem.quantity,
            lastSold: new Date().toISOString()
          };
        }
        return p;
      });

      // 4. GENERATE ALERTS (Post-Update)
      const lowStockItems = newProducts.filter(p => 
        sale.items.some(i => i.productId === p.id) && p.stock <= p.minStock
      );

      if (lowStockItems.length > 0) {
        const newAlerts = lowStockItems.map(p => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'CRITICAL' as const,
          category: 'INVENTORY' as const,
          message: `${p.name} is low on stock (${p.stock} remaining)`,
          timestamp: 'Just now',
          isRead: false
        }));
        setAlerts(prev => [...newAlerts, ...prev]);
      }

      return newProducts;
    });

    return true; // Success
  };

  const refreshAIInsights = async () => {
    return await analyzeStoreHealth(products, staffMetrics);
  };

  const resetData = () => {
    if(confirm("Factory Reset Brian Store AI? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <StoreContext.Provider value={{ products, sales, alerts, staffMetrics, settings, addProduct, recordSale, refreshAIInsights, resetData, updateSettings }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pos" element={<POS />} />
            <Route path="insights" element={<Insights />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreContext.Provider>
  );
};

export default App;