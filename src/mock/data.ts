import { Transaction, FamilyMember, Budget } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Whole Foods Market', amount: 142.80, category: 'Groceries', date: 'Today, 5:42 PM', type: 'expense' },
  { id: '2', title: 'Freelance Payment', amount: 2400.00, category: 'Income', date: 'Yesterday', type: 'income' },
  { id: '3', title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: 'Oct 21', type: 'expense' },
  { id: '4', title: 'Starbucks', amount: 6.50, category: 'Dining', date: 'Oct 20', type: 'expense' },
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Jane', role: 'Admin', avatar: 'https://picsum.photos/seed/jane/200', status: 'online' },
  { id: '2', name: 'John', role: 'Admin', avatar: 'https://picsum.photos/seed/john/200', status: 'online' },
  { id: '3', name: 'Leo', role: 'Child', avatar: 'https://picsum.photos/seed/leo/200', status: 'offline' },
];

export const MOCK_BUDGETS: Budget[] = [
  { category: 'Shopping', spent: 400, limit: 500 },
  { category: 'Dining', spent: 580, limit: 600 },
  { category: 'Transport', spent: 150, limit: 100 },
  { category: 'Utilities', spent: 200, limit: 300 },
];

export const MOCK_BALANCE = {
  total: 12450.00,
  currency: 'USD',
  monthlyChange: 450,
};

export const MOCK_FX_RATES: Record<string, number> = {
  USD: 1,
  CNY: 7.24,
  EUR: 0.92,
  GBP: 0.79,
};
