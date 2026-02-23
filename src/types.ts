export type Category = 'Groceries' | 'Dining' | 'Transport' | 'Shopping' | 'Entertainment' | 'Travel' | 'Utilities' | 'Income' | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  type: 'expense' | 'income';
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Admin' | 'Member' | 'Child';
  avatar: string;
  status: 'online' | 'offline';
}

export interface Budget {
  category: Category;
  spent: number;
  limit: number;
}
