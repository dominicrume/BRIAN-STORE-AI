export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  lastSold?: string;
}

export interface Sale {
  id: string;
  total: number;
  date: string;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Card';
  items: { productId: string; quantity: number }[];
}

export interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  category: 'INVENTORY' | 'STAFF' | 'FINANCE';
}

export interface StaffMetric {
  name: string;
  shift: string;
  riskScore: number; // 0-100, higher is riskier
  voidedTransactions: number;
  cashDiscrepancy: number;
}

export interface StoreContextType {
  products: Product[];
  sales: Sale[];
  alerts: Alert[];
  staffMetrics: StaffMetric[];
  addProduct: (product: Product) => void;
  recordSale: (sale: Sale) => void;
  refreshAIInsights: () => Promise<string>;
}
