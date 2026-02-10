import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Insights from './pages/Insights';
import AIAssistant from './pages/AIAssistant';
import { Product, Sale, Alert, StaffMetric, StoreContextType } from './types';
import { MOCK_PRODUCTS, MOCK_SALES, MOCK_ALERTS, MOCK_STAFF } from './constants';
import { analyzeStoreHealth } from './services/geminiService';

export const StoreContext = React.createContext<StoreContextType>({
  products: [],
  sales: [],
  alerts: [],
  staffMetrics: [],
  addProduct: () => {},
  recordSale: () => {},
  refreshAIInsights: async () => "",
});

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [staffMetrics, setStaffMetrics] = useState<StaffMetric[]>(MOCK_STAFF);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const recordSale = (sale: Sale) => {
    // 1. Add Sale Record
    setSales(prev => [sale, ...prev]);

    // 2. Decrement Inventory
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      sale.items.forEach(item => {
        const productIndex = newProducts.findIndex(p => p.id === item.productId);
        if (productIndex > -1) {
          newProducts[productIndex] = {
            ...newProducts[productIndex],
            stock: Math.max(0, newProducts[productIndex].stock - item.quantity),
            lastSold: new Date().toISOString()
          };
          
          // Check for Low Stock Alert immediately
          if (newProducts[productIndex].stock <= newProducts[productIndex].minStock) {
            setAlerts(prevAlerts => [{
              id: Math.random().toString(),
              type: 'CRITICAL',
              category: 'INVENTORY',
              message: `${newProducts[productIndex].name} is low on stock (${newProducts[productIndex].stock})`,
              timestamp: 'Just now'
            }, ...prevAlerts]);
          }
        }
      });
      return newProducts;
    });
  };

  const refreshAIInsights = async () => {
    return await analyzeStoreHealth(products, staffMetrics);
  };

  return (
    <StoreContext.Provider value={{ products, sales, alerts, staffMetrics, addProduct, recordSale, refreshAIInsights }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pos" element={<POS />} />
            <Route path="insights" element={<Insights />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreContext.Provider>
  );
};

export default App;
