import React, { useState } from 'react';
import { Home, PieChart, Users, Settings, Plus, Calendar, CreditCard, ShoppingBasket, Utensils, Car, ShoppingBag, Film, Plane, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'spacer', label: '', icon: null },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-black/5 pb-4 pt-2 px-6">
      <div className="flex justify-between items-center relative">
        {tabs.map((tab) => {
          if (tab.id === 'spacer') return <div key="spacer" className="w-12" />;
          const Icon = tab.icon!;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${isActive ? 'text-mint' : 'text-muted hover:text-forest'}`}
            >
              <Icon size={22} fill={isActive ? 'currentColor' : 'none'} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={onAddClick}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-mint hover:bg-mint-dark text-white rounded-full shadow-lg shadow-mint/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50"
        >
          <Plus size={32} />
        </button>
      </div>
    </nav>
  );
};

export const QuickRecordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('45.00');
  const [category, setCategory] = useState('Groceries');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');

  const categories = [
    { name: 'Groceries', icon: ShoppingBasket },
    { name: 'Dining', icon: Utensils },
    { name: 'Transport', icon: Car },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Fun', icon: Film },
    { name: 'Travel', icon: Plane },
  ];

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  const handleKey = (key: string) => {
    if (key === '.' && amount.includes('.')) return;
    if (amount === '0' && key !== '.') { setAmount(key); return; }
    const parts = amount.split('.');
    if (parts[1]?.length >= 2) return;
    setAmount(amount + key);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-50" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 right-0 z-50 h-[92%] bg-white rounded-t-[40px] shadow-2xl flex flex-col"
      >
        <div className="w-full flex justify-center pt-4 pb-2 cursor-grab">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* 支出/收入切换 */}
        <div className="flex mx-6 mt-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setTxType('expense')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${txType === 'expense' ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}
          >
            Expense
          </button>
          <button
            onClick={() => setTxType('income')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${txType === 'income' ? 'bg-white text-mint shadow-sm' : 'text-muted'}`}
          >
            Income
          </button>
        </div>

        <div className="flex flex-col items-center px-6 pt-4 pb-4">
          <div className="flex items-baseline justify-center gap-1 mb-4 w-full">
            <span className={`text-3xl font-display font-medium ${txType === 'income' ? 'text-mint' : 'text-forest'}`}>$</span>
            <span className={`font-mono text-[64px] leading-tight ${txType === 'income' ? 'text-mint' : 'text-ink'}`}>{amount}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 w-full">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-canvas rounded-xl hover:bg-slate-100 transition-colors">
              <Calendar size={20} className="text-mint" /><span className="text-sm font-medium">Today</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-canvas rounded-xl hover:bg-slate-100 transition-colors">
              <CreditCard size={20} className="text-mint" /><span className="text-sm font-medium">Chase Sapphire</span>
            </button>
          </div>
        </div>
        <div className="border-t border-b border-slate-50 py-6 mb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 px-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <button key={cat.name} onClick={() => setCategory(cat.name)} className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-mint text-white shadow-lg ring-4 ring-mint/20 scale-105' : 'bg-canvas border border-slate-200 text-muted hover:border-mint/50 hover:text-mint'}`}>
                    <Icon size={28} />
                  </div>
                  <span className={`text-xs font-display ${isSelected ? 'font-bold text-forest' : 'font-medium text-muted'}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end pb-6 px-6">
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto w-full">
            {keypad.map((key) => (
              <button key={key} onClick={() => handleKey(key)}
                className="h-16 flex items-center justify-center rounded-2xl text-2xl font-display font-semibold text-ink hover:bg-slate-100 active:bg-slate-200 transition-all">
                {key}
              </button>
            ))}
            <button onClick={onClose}
              className="h-16 flex items-center justify-center rounded-full bg-mint text-white shadow-lg hover:bg-mint-dark active:scale-95 transition-all">
              <Check size={32} strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
