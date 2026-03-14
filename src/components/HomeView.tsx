import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBasket, Banknote, Film, Coffee, LucideProps } from 'lucide-react';
import { transactionsApi } from '../api';
import { Transaction } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  Groceries: ShoppingBasket,
  Income: Banknote,
  Entertainment: Film,
  Dining: Coffee,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns a human-readable day + date string based on today's actual date. */
export function getTodayLabel(): { weekday: string; dayMonth: string } {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayMonth = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { weekday, dayMonth };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-[20px] border border-transparent animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-slate-100" />
      <div className="flex flex-col gap-2">
        <div className="w-32 h-3.5 bg-slate-100 rounded-full" />
        <div className="w-20 h-2.5 bg-slate-100 rounded-full" />
      </div>
    </div>
    <div className="w-16 h-3.5 bg-slate-100 rounded-full" />
  </div>
);

const ErrorBanner: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
    <span className="text-4xl">⚠️</span>
    <p className="text-sm text-slate-500">Could not load transactions.</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 text-sm font-semibold text-mint border border-mint/30 rounded-full hover:bg-mint/5 transition-colors"
    >
      Try again
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface HomeViewProps {
  onOpenFamily?: () => void;
  onShowNotice?: (message: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenFamily, onShowNotice }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { weekday, dayMonth } = getTodayLabel();
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 3);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await transactionsApi.list();
      setTransactions(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between py-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-display">{weekday}</span>
          <h1 className="text-2xl font-bold font-display text-ink leading-none mt-1">{dayMonth}</h1>
        </div>
        <button
          className="relative"
          onClick={() => onShowNotice?.('Profile editing stays in the native app flow for now.')}
        >
          <div className="w-10 h-10 rounded-full bg-forest overflow-hidden ring-2 ring-transparent hover:ring-mint transition-all">
            <img alt="Profile" className="w-full h-full object-cover" src="https://picsum.photos/seed/profile/200" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-mint border-2 border-canvas rounded-full"></div>
        </button>
      </header>

      <div className="relative w-full p-8 rounded-[20px] bg-white shadow-lg border border-mint/10 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-mint/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-muted mb-2">Total Balance</span>
          <h2 className="text-5xl font-mono font-medium text-forest tracking-tight mb-3">$12,450.00</h2>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-mint/10 rounded-full">
            <TrendingUp size={18} className="text-mint" />
            <span className="text-sm font-bold text-mint">+$450</span>
            <span className="text-sm text-muted">this month</span>
          </div>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-[20px] mx-auto w-full max-w-[280px]">
        <button className="flex-1 py-2 text-sm font-semibold text-forest bg-white rounded-[18px] shadow-sm">Personal</button>
        <button
          className="flex-1 py-2 text-sm font-medium text-muted hover:text-ink"
          onClick={() => onOpenFamily?.()}
        >
          Family
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold font-display text-ink">Recent Activity</h3>
          <button
            className="text-sm font-medium text-mint hover:text-mint-dark"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {!loading && error && <ErrorBanner onRetry={fetchTransactions} />}

        {!loading && !error && visibleTransactions.map((tx) => {
          const Icon: IconComponent = ICON_MAP[tx.category] ?? ShoppingBasket;
          return (
            <div key={tx.id} className="group flex items-center justify-between p-4 bg-white rounded-[20px] hover:shadow-md transition-all border border-transparent hover:border-mint/10 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mint/10 text-forest group-hover:bg-mint group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-bold text-ink">{tx.title}</p>
                  <p className="text-xs font-medium text-muted uppercase tracking-wide">{tx.date}</p>
                </div>
              </div>
              <span className={`text-base font-mono font-medium ${tx.type === 'income' ? 'text-mint' : 'text-ink'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          );
        })}

        {!loading && !error && transactions.length > 3 && !showAll && (
          <p className="px-2 text-xs text-muted">
            Showing 3 of {transactions.length} recent transactions.
          </p>
        )}
      </div>
    </div>
  );
};
