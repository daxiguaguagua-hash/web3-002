/**
 * Tests for API layer (mock mode)
 * Skill: test-gen — AAA 模式
 *
 * 注意：所有测试在 mock 模式下运行（VITE_APP_MODE 默认为 'mock'）
 */
import { describe, it, expect } from 'vitest';
import { transactionsApi, balanceApi, budgetApi, familyApi, privacyApi, fxApi } from '../api';

// ─── transactionsApi ─────────────────────────────────────────────────────────

describe('transactionsApi (mock mode)', () => {
  describe('list()', () => {
    it('应返回非空的交易数组', async () => {
      // Act
      const result = await transactionsApi.list();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('每条交易应包含必要字段', async () => {
      // Act
      const result = await transactionsApi.list();

      // Assert
      result.forEach((tx) => {
        expect(tx).toHaveProperty('id');
        expect(tx).toHaveProperty('title');
        expect(tx).toHaveProperty('amount');
        expect(tx).toHaveProperty('category');
        expect(tx).toHaveProperty('date');
        expect(tx.type === 'expense' || tx.type === 'income').toBe(true);
      });
    });

    it('amount 应为正数', async () => {
      // Act
      const result = await transactionsApi.list();

      // Assert
      result.forEach((tx) => {
        expect(tx.amount).toBeGreaterThan(0);
      });
    });
  });

  describe('save()', () => {
    it('应返回含新生成 id 的交易对象', async () => {
      // Arrange
      const payload = {
        title: 'Test Coffee',
        amount: 5.5,
        category: 'Dining',
        type: 'expense' as const,
        accountId: 'acc-1',
        occurredAt: new Date().toISOString(),
        occurredLocalDate: '2025-01-01',
        currency: 'USD',
        fxRateToBase: 1,
        fxSource: 'api' as const,
      };

      // Act
      const result = await transactionsApi.save(payload);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Coffee');
      expect(result.amount).toBe(5.5);
      expect(result.type).toBe('expense');
    });

    it('type 为 transfer 时应映射为 expense', async () => {
      // Arrange
      const payload = {
        title: 'Transfer',
        amount: 100,
        category: 'Other',
        type: 'transfer' as const,
        accountId: 'acc-1',
        occurredAt: new Date().toISOString(),
        occurredLocalDate: '2025-01-01',
        currency: 'USD',
        fxRateToBase: 1,
        fxSource: 'api' as const,
      };

      // Act
      const result = await transactionsApi.save(payload);

      // Assert
      expect(result.type).toBe('expense');
    });
  });

  describe('delete()', () => {
    it('应在 mock 模式下正常完成（不抛出）', async () => {
      // Act & Assert
      await expect(transactionsApi.delete('tx-123')).resolves.toBeUndefined();
    });
  });
});

// ─── balanceApi ───────────────────────────────────────────────────────────────

describe('balanceApi (mock mode)', () => {
  describe('get()', () => {
    it('应返回含 total、currency、monthlyChange 的余额对象', async () => {
      // Act
      const result = await balanceApi.get();

      // Assert
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('monthlyChange');
    });

    it('total 应为正数', async () => {
      // Act
      const result = await balanceApi.get();

      // Assert
      expect(result.total).toBeGreaterThan(0);
    });
  });
});

// ─── budgetApi ────────────────────────────────────────────────────────────────

describe('budgetApi (mock mode)', () => {
  describe('list()', () => {
    it('应返回预算数组', async () => {
      // Act
      const result = await budgetApi.list();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('每条预算应包含 category、spent、limit', async () => {
      // Act
      const result = await budgetApi.list();

      // Assert
      result.forEach((b) => {
        expect(b).toHaveProperty('category');
        expect(b).toHaveProperty('spent');
        expect(b).toHaveProperty('limit');
        expect(typeof b.spent).toBe('number');
        expect(typeof b.limit).toBe('number');
      });
    });

    it('超支预算的 spent 应大于 limit', async () => {
      // Act
      const result = await budgetApi.list();

      // Assert — Transport 在 mock 数据里是超支的
      const overBudget = result.filter((b) => b.spent > b.limit);
      expect(overBudget.length).toBeGreaterThan(0);
    });
  });
});

// ─── familyApi ────────────────────────────────────────────────────────────────

describe('familyApi (mock mode)', () => {
  describe('getMembers()', () => {
    it('应返回成员数组', async () => {
      // Act
      const result = await familyApi.getMembers();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('每个成员应包含 id、name、role、avatar、status', async () => {
      // Act
      const result = await familyApi.getMembers();

      // Assert
      result.forEach((m) => {
        expect(m).toHaveProperty('id');
        expect(m).toHaveProperty('name');
        expect(['Admin', 'Member', 'Child']).toContain(m.role);
        expect(m).toHaveProperty('avatar');
        expect(['online', 'offline']).toContain(m.status);
      });
    });
  });

  describe('invite()', () => {
    it('应在 mock 模式下正常完成（不抛出）', async () => {
      // Act & Assert
      await expect(familyApi.invite('test@example.com', 'Member')).resolves.toBeUndefined();
    });
  });
});

// ─── privacyApi ───────────────────────────────────────────────────────────────

describe('privacyApi (mock mode)', () => {
  describe('verifyPin()', () => {
    it('4位 PIN 应验证成功', async () => {
      // Arrange
      const validPin = '1234';

      // Act
      const result = await privacyApi.verifyPin(validPin);

      // Assert
      expect(result.success).toBe(true);
    });

    it('少于4位的 PIN 应验证失败', async () => {
      // Arrange
      const shortPin = '123';

      // Act
      const result = await privacyApi.verifyPin(shortPin);

      // Assert
      expect(result.success).toBe(false);
    });

    it('空 PIN 应验证失败', async () => {
      // Arrange
      const emptyPin = '';

      // Act
      const result = await privacyApi.verifyPin(emptyPin);

      // Assert
      expect(result.success).toBe(false);
    });
  });
});

// ─── fxApi ────────────────────────────────────────────────────────────────────

describe('fxApi (mock mode)', () => {
  describe('getRates()', () => {
    it('应返回含 base、rates、isFallback 的汇率对象', async () => {
      // Act
      const result = await fxApi.getRates();

      // Assert
      expect(result).toHaveProperty('base');
      expect(result).toHaveProperty('rates');
      expect(result).toHaveProperty('isFallback');
      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('timestamp');
    });

    it('mock 模式默认应返回 isFallback=false', async () => {
      // Act
      const result = await fxApi.getRates();

      // Assert
      expect(result.isFallback).toBe(false);
    });

    it('默认 base 货币应为 CNY', async () => {
      // Act
      const result = await fxApi.getRates();

      // Assert
      expect(result.base).toBe('CNY');
    });

    it('传入自定义 base 货币应反映在返回值中', async () => {
      // Act
      const result = await fxApi.getRates('USD');

      // Assert
      expect(result.base).toBe('USD');
    });

    it('rates 应为非空对象', async () => {
      // Act
      const result = await fxApi.getRates();

      // Assert
      expect(typeof result.rates).toBe('object');
      expect(Object.keys(result.rates).length).toBeGreaterThan(0);
    });

    it('source 在 mock 模式下应为 "api"', async () => {
      // Act
      const result = await fxApi.getRates();

      // Assert
      expect(result.source).toBe('api');
    });
  });
});
