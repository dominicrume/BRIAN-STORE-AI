import { Product, Sale, Alert, StaffMetric } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Blue Band Margarine 500g', category: 'Pantry', price: 4.50, cost: 3.50, stock: 12, minStock: 20 },
  { id: '2', name: 'Coca Cola 500ml', category: 'Beverages', price: 1.00, cost: 0.70, stock: 145, minStock: 50 },
  { id: '3', name: 'Indomie Noodles (Chicken)', category: 'Pantry', price: 0.50, cost: 0.35, stock: 8, minStock: 50 },
  { id: '4', name: 'Pampers Diapers (Size 4)', category: 'Baby', price: 15.00, cost: 11.00, stock: 5, minStock: 10 },
  { id: '5', name: 'Dangote Sugar 1kg', category: 'Pantry', price: 2.20, cost: 1.80, stock: 40, minStock: 15 },
  { id: '6', name: 'Guinness Stout', category: 'Alcohol', price: 2.50, cost: 1.90, stock: 2, minStock: 24 },
];

export const MOCK_SALES: Sale[] = [
  { id: '101', total: 12.50, date: new Date().toISOString(), paymentMethod: 'Mobile Money', items: [] },
  { id: '102', total: 4.00, date: new Date().toISOString(), paymentMethod: 'Cash', items: [] },
  { id: '103', total: 22.00, date: new Date(Date.now() - 86400000).toISOString(), paymentMethod: 'Card', items: [] },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'CRITICAL', message: 'Indomie Noodles stock critical (8 units)', timestamp: '10 mins ago', category: 'INVENTORY' },
  { id: 'a2', type: 'WARNING', message: 'Cash drawer open for > 5 mins without sale', timestamp: '1 hour ago', category: 'STAFF' },
  { id: 'a3', type: 'INFO', message: 'Delivery from Supplier B expected tomorrow', timestamp: '2 hours ago', category: 'INVENTORY' },
];

export const MOCK_STAFF: StaffMetric[] = [
  { name: 'Samuel O.', shift: 'Morning', riskScore: 12, voidedTransactions: 1, cashDiscrepancy: 0 },
  { name: 'Grace K.', shift: 'Afternoon', riskScore: 65, voidedTransactions: 8, cashDiscrepancy: 15.50 },
  { name: 'David M.', shift: 'Night', riskScore: 24, voidedTransactions: 2, cashDiscrepancy: 2.00 },
];
