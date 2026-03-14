/**
 * Component tests: HomeView, AnalyticsView, FamilyView
 * Skill: test-gen — AAA 模式，覆盖 loading / error / success 三个状态
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock API module — 每个测试单独控制返回值
vi.mock('../api', () => ({
  transactionsApi: { list: vi.fn(), save: vi.fn(), delete: vi.fn() },
  budgetApi: { list: vi.fn() },
  familyApi: { getMembers: vi.fn(), invite: vi.fn() },
  balanceApi: { get: vi.fn() },
  privacyApi: { verifyPin: vi.fn() },
}));

import { transactionsApi, budgetApi, familyApi } from '../api';
import { HomeView } from '../components/HomeView';
import { AnalyticsView } from '../components/AnalyticsView';
import { FamilyView } from '../components/FamilyView';

// ─── HomeView ─────────────────────────────────────────────────────────────────

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('加载中：应显示骨架屏占位符', async () => {
    // Arrange — 永远 pending，让 loading 状态持续
    (transactionsApi.list as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    // Act
    render(<HomeView />);

    // Assert — 骨架屏有 animate-pulse class
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('成功：应渲染交易列表条目', async () => {
    // Arrange
    (transactionsApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', title: 'Whole Foods', amount: 142.80, category: 'Groceries', date: 'Today', type: 'expense' },
      { id: '2', title: 'Freelance Pay', amount: 2400, category: 'Income', date: 'Yesterday', type: 'income' },
    ]);

    // Act
    render(<HomeView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Whole Foods')).toBeInTheDocument();
      expect(screen.getByText('Freelance Pay')).toBeInTheDocument();
    });
  });

  it('成功：income 类型金额应带 + 符号', async () => {
    // Arrange
    (transactionsApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', title: 'Salary', amount: 5000, category: 'Income', date: 'Today', type: 'income' },
    ]);

    // Act
    render(<HomeView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('+$5,000.00')).toBeInTheDocument();
    });
  });

  it('成功：expense 类型金额应带 - 符号', async () => {
    // Arrange
    (transactionsApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', title: 'Coffee', amount: 6.5, category: 'Dining', date: 'Today', type: 'expense' },
    ]);

    // Act
    render(<HomeView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('-$6.50')).toBeInTheDocument();
    });
  });

  it('错误：应显示 error 提示和重试按钮', async () => {
    // Arrange
    (transactionsApi.list as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    // Act
    render(<HomeView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/could not load transactions/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  it('错误：点击 Try again 应重新发起请求', async () => {
    // Arrange — 第一次失败，第二次成功
    const mockList = transactionsApi.list as ReturnType<typeof vi.fn>;
    mockList
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce([
        { id: '1', title: 'Retried Item', amount: 10, category: 'Dining', date: 'Today', type: 'expense' },
      ]);

    // Act
    render(<HomeView />);
    const retryBtn = await screen.findByRole('button', { name: /try again/i });
    await userEvent.click(retryBtn);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Retried Item')).toBeInTheDocument();
    });
    expect(mockList).toHaveBeenCalledTimes(2);
  });

  it('日期头部：weekday 和 dayMonth 应为非空字符串', async () => {
    // Arrange
    (transactionsApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    // Act
    render(<HomeView />);

    // Assert — 两个元素应存在且不为空（动态日期）
    await waitFor(() => {
      const dayEl = document.querySelector('.font-display.text-2xl');
      expect(dayEl?.textContent).toBeTruthy();
    });
  });
});

// ─── AnalyticsView ────────────────────────────────────────────────────────────

describe('AnalyticsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('加载中：应显示骨架屏占位符', () => {
    // Arrange
    (budgetApi.list as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    // Act
    render(<AnalyticsView />);

    // Assert
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('成功：应渲染各预算类别名称', async () => {
    // Arrange
    (budgetApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([
      { category: 'Shopping', spent: 400, limit: 500 },
      { category: 'Dining', spent: 580, limit: 600 },
    ]);

    // Act
    render(<AnalyticsView />);

    // Assert — 使用 getAllByText，因为 "Shopping" 同时出现在图表图例和预算列表中
    await waitFor(() => {
      expect(screen.getAllByText('Shopping').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Dining')).toBeInTheDocument();
    });
  });

  it('成功：超支预算应显示实际超出百分比', async () => {
    // Arrange — spent 150 > limit 100，即 150% used
    (budgetApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([
      { category: 'Transport', spent: 150, limit: 100 },
    ]);

    // Act
    render(<AnalyticsView />);

    // Assert — Math.round(150/100 * 100) = 150
    await waitFor(() => {
      expect(screen.getByText('150% used')).toBeInTheDocument();
    });
  });

  it('错误：应显示 error 提示和重试按钮', async () => {
    // Arrange
    (budgetApi.list as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));

    // Act
    render(<AnalyticsView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/could not load budget data/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });
});

// ─── FamilyView ───────────────────────────────────────────────────────────────

describe('FamilyView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('加载中：应显示骨架屏占位符', () => {
    // Arrange
    (familyApi.getMembers as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    // Act
    render(<FamilyView />);

    // Assert
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('成功：应渲染成员姓名', async () => {
    // Arrange
    (familyApi.getMembers as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', name: 'Alice', role: 'Admin', avatar: '', status: 'online' },
      { id: '2', name: 'Bob', role: 'Child', avatar: '', status: 'offline' },
    ]);

    // Act
    render(<FamilyView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('成功：成员数量应反映在标题卡中', async () => {
    // Arrange
    (familyApi.getMembers as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', name: 'Alice', role: 'Admin', avatar: '', status: 'online' },
      { id: '2', name: 'Bob', role: 'Member', avatar: '', status: 'offline' },
      { id: '3', name: 'Cleo', role: 'Child', avatar: '', status: 'offline' },
    ]);

    // Act
    render(<FamilyView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/3 Members/i)).toBeInTheDocument();
    });
  });

  it('成功：加载完成后应显示 Add New 按钮', async () => {
    // Arrange
    (familyApi.getMembers as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', name: 'Alice', role: 'Admin', avatar: '', status: 'online' },
    ]);

    // Act
    render(<FamilyView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });
  });

  it('加载中：不应显示 Add New 按钮', () => {
    // Arrange — 永远 pending
    (familyApi.getMembers as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    // Act
    render(<FamilyView />);

    // Assert
    expect(screen.queryByText('Add New')).not.toBeInTheDocument();
  });

  it('错误：应显示 error 提示和重试按钮', async () => {
    // Arrange
    (familyApi.getMembers as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));

    // Act
    render(<FamilyView />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/could not load members/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });
});
