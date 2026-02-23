import React from 'react';
import { ArrowLeft, MoreHorizontal, TrendingDown, ShoppingBag, Utensils, Car, Zap, Lightbulb } from 'lucide-react';
import { MOCK_BUDGETS } from '../constants';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between py-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-ink">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display font-bold text-2xl tracking-tight">Financial Vitals</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-ink">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className="bg-slate-100 p-1 rounded-xl flex items-center">
        <button className="flex-1 py-1.5 text-[13px] font-semibold text-muted">Week</button>
        <button className="flex-1 py-1.5 text-[13px] font-bold text-mint bg-white shadow-sm rounded-lg">Month</button>
        <button className="flex-1 py-1.5 text-[13px] font-semibold text-muted">Year</button>
      </div>

      <section className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center">
        <div className="relative w-60 h-60 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="120" cy="120" r="100" fill="none" stroke="#00C896" strokeWidth="24" strokeDasharray="628" strokeDashoffset="345" />
            <circle cx="120" cy="120" r="100" fill="none" stroke="#004D40" strokeWidth="24" strokeDasharray="628" strokeDashoffset="500" />
            <circle cx="120" cy="120" r="100" fill="none" stroke="#2DD4BF" strokeWidth="24" strokeDasharray="628" strokeDashoffset="580" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-muted text-[11px] font-bold uppercase tracking-widest">Total Spent</span>
            <span className="font-display text-4xl font-bold text-ink">$2,450</span>
            <div className="flex items-center gap-1 mt-2 text-mint font-bold text-sm">
              <TrendingDown size={14} />
              <span>12%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-6 pt-6 border-t border-slate-50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-mint" />
              <span className="text-[13px] text-muted">Shopping</span>
            </div>
            <span className="text-[13px] font-semibold">45%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-forest" />
              <span className="text-[13px] text-muted">Housing</span>
            </div>
            <span className="text-[13px] font-semibold">25%</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl text-ink">Budget Status</h2>
          <button className="text-mint text-sm font-medium">Edit Limits</button>
        </div>

        <div className="space-y-4">
          {MOCK_BUDGETS.map((budget) => (
            <div key={budget.category} className="bg-white p-4 rounded-2xl border border-slate-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint/10 flex items-center justify-center text-mint">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-ink">{budget.category}</h4>
                    <p className="text-xs text-muted">Target: ${budget.limit.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">${budget.spent.toFixed(2)}</span>
                  <span className="text-xs text-muted block">{Math.round((budget.spent / budget.limit) * 100)}% used</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-mint'}`} 
                  style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-mint">
            <Lightbulb size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Insights</span>
              <span className="text-[10px] opacity-40">Just now</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Groceries Savings</h3>
            <p className="text-xs opacity-70 leading-relaxed">You've spent 15% less on groceries compared to last month. Great job keeping the budget lean!</p>
          </div>
        </div>
      </section>
    </div>
  );
};
