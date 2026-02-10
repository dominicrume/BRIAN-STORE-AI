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
  items: { productId: string; quantity: number; name: string; price: number }[]; // Added name/price snapshot for historical accuracy
  status: 'COMPLETED' | 'PENDING_SYNC'; // Offline-first status
}

export interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  category: 'INVENTORY' | 'STAFF' | 'FINANCE';
  isRead: boolean; // UX improvement
}

export interface StaffMetric {
  name: string;
  shift: string;
  riskScore: number; // 0-100, higher is riskier
  voidedTransactions: number;
  cashDiscrepancy: number;
}

export interface StoreSettings {
  isEnterprise: boolean;
  quickBooksConnected: boolean;
  paymentProcessorConnected: boolean;
  currency: string;
  storeName: string;
}

export interface StoreContextType {
  products: Product[];
  sales: Sale[];
  alerts: Alert[];
  staffMetrics: StaffMetric[];
  settings: StoreSettings;
  addProduct: (product: Product) => void;
  recordSale: (sale: Sale) => boolean; // Returns success/fail
  refreshAIInsights: () => Promise<string>;
  resetData: () => void; // For debugging/demo
  updateSettings: (settings: Partial<StoreSettings>) => void;
}