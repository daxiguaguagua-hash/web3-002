/**
 * API Layer — MintLedger
 * Supports three modes: mock | dev | prod
 * Mode is controlled by VITE_APP_MODE env variable
 */

import { config, isMock, isDev } from '../config/mode';
import {
  MOCK_TRANSACTIONS,
  MOCK_FAMILY_MEMBERS,
  MOCK_BUDGETS,
  MOCK_BALANCE,
  MOCK_FX_RATES,
} from '../mock/data';
import { Transaction, FamilyMember, Budget } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const log = (...args: unknown[]) => {
  if (config.debug) console.log('[MintLedger API]', ...args);
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`;
  log(`${options?.method || 'GET'} ${url}`);
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── Response Types ──────────────────────────────────────────────────────────

export interface BalanceResponse {
  total: number;
  currency: string;
  monthlyChange: number;
}

export interface FxRateResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
  source: 'api' | 'cache' | 'fallback';
  /** true when rate service unavailable — UI must show modal alert per PRD §4.2.2 */
  isFallback: boolean;
}

export interface SaveTransactionPayload {
  title: string;
  amount: number;
  category: string;
  type: 'expense' | 'income' | 'transfer';
  accountId: string;
  occurredAt: string;
  /** Local date string e.g. "2025-10-24" — required for Child delete permission (PRD §4.4.2) */
  occurredLocalDate: string;
  currency: string;
  fxRateToBase: number;
  fxSource: 'api' | 'manual';
  note?: string;
}

// ─── Transactions ────────────────────────────────────────────────────────────

export const transactionsApi = {
  list: async (): Promise<Transaction[]> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → transactions.list');
      return MOCK_TRANSACTIONS;
    }
    return request<Transaction[]>('/api/v1/transactions');
  },

  save: async (payload: SaveTransactionPayload): Promise<Transaction> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → transactions.save', payload);
      const newTx: Transaction = {
        id: Date.now().toString(),
        title: payload.title,
        amount: payload.amount,
        category: payload.category as Transaction['category'],
        date: 'Just now',
        type: payload.type === 'transfer' ? 'expense' : payload.type,
      };
      return newTx;
    }
    return request<Transaction>('/api/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → transactions.delete', id);
      return;
    }
    return request<void>(`/api/v1/transactions/${id}`, { method: 'DELETE' });
  },
};

// ─── Balance ─────────────────────────────────────────────────────────────────

export const balanceApi = {
  get: async (): Promise<BalanceResponse> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → balance.get');
      return MOCK_BALANCE;
    }
    return request<BalanceResponse>('/api/v1/balance');
  },
};

// ─── FX Rates ────────────────────────────────────────────────────────────────

export const fxApi = {
  /**
   * Fetches current FX rates.
   * PRD §4.2.2: If unavailable, returns isFallback=true and all rates=1.
   * UI must show modal alert when isFallback=true.
   */
  getRates: async (baseCurrency = 'CNY'): Promise<FxRateResponse> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      // Toggle this to simulate fx failure in demo:
      const simulateFailure = false;
      if (simulateFailure) {
        log('mock → fx.getRates [FALLBACK — simulating failure]');
        return {
          base: baseCurrency,
          rates: Object.fromEntries(Object.keys(MOCK_FX_RATES).map((k) => [k, 1])),
          timestamp: new Date().toISOString(),
          source: 'fallback',
          isFallback: true,
        };
      }
      log('mock → fx.getRates');
      return {
        base: baseCurrency,
        rates: MOCK_FX_RATES,
        timestamp: new Date().toISOString(),
        source: 'api',
        isFallback: false,
      };
    }
    try {
      return await request<FxRateResponse>(`/api/v1/fx/rates?base=${baseCurrency}`);
    } catch (err) {
      log('fx.getRates failed — using 1:1 fallback', err);
      return {
        base: baseCurrency,
        rates: {},
        timestamp: new Date().toISOString(),
        source: 'fallback',
        isFallback: true,
      };
    }
  },
};

// ─── Family ──────────────────────────────────────────────────────────────────

export const familyApi = {
  getMembers: async (): Promise<FamilyMember[]> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → family.getMembers');
      return MOCK_FAMILY_MEMBERS;
    }
    return request<FamilyMember[]>('/api/v1/family/members');
  },

  invite: async (email: string, role: string): Promise<void> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → family.invite', { email, role });
      return;
    }
    return request<void>('/api/v1/family/invite', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },
};

// ─── Budgets ─────────────────────────────────────────────────────────────────

export const budgetApi = {
  list: async (): Promise<Budget[]> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → budget.list');
      return MOCK_BUDGETS;
    }
    return request<Budget[]>('/api/v1/budgets');
  },
};

// ─── Privacy / Hidden Ledger ─────────────────────────────────────────────────

export const privacyApi = {
  /**
   * Verify PIN for hidden ledger access.
   * PRD §4.6: Biometric fails 3× → PIN fallback.
   * NOTE: In real app, PIN verification happens on-device (Keychain/Keystore).
   * This endpoint is only for server-side audit if needed.
   */
  verifyPin: async (pin: string): Promise<{ success: boolean }> => {
    if (isMock()) {
      await sleep(config.mockDelay);
      log('mock → privacy.verifyPin');
      // Mock: any 4-digit PIN works in demo
      return { success: pin.length === 4 };
    }
    return request<{ success: boolean }>('/api/v1/privacy/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  },

  /**
   * PRD §4.6 + §4.7: Hidden ledger must NEVER be exported or synced to cloud.
   * These endpoints are intentionally absent — no export/share API exists for privacy ledger.
   */
};
