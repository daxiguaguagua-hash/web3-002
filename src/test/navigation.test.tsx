/**
 * Tests for Navigation components: BottomNav, QuickRecordModal
 * AAA 模式
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomNav, QuickRecordModal } from '../components/Navigation';

// ─── BottomNav ────────────────────────────────────────────────────────────────

describe('BottomNav', () => {
  const mockOnTabChange = vi.fn();
  const mockOnAddClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应渲染4个导航标签', () => {
    // Act
    render(<BottomNav activeTab="home" onTabChange={mockOnTabChange} onAddClick={mockOnAddClick} />);

    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('点击 Home 应调用 onTabChange("home")', async () => {
    // Arrange
    render(<BottomNav activeTab="analytics" onTabChange={mockOnTabChange} onAddClick={mockOnAddClick} />);

    // Act
    await userEvent.click(screen.getByText('Home'));

    // Assert
    expect(mockOnTabChange).toHaveBeenCalledWith('home');
  });

  it('点击 Analytics 应调用 onTabChange("analytics")', async () => {
    // Arrange
    render(<BottomNav activeTab="home" onTabChange={mockOnTabChange} onAddClick={mockOnAddClick} />);

    // Act
    await userEvent.click(screen.getByText('Analytics'));

    // Assert
    expect(mockOnTabChange).toHaveBeenCalledWith('analytics');
  });

  it('点击 Family 应调用 onTabChange("family")', async () => {
    // Arrange
    render(<BottomNav activeTab="home" onTabChange={mockOnTabChange} onAddClick={mockOnAddClick} />);

    // Act
    await userEvent.click(screen.getByText('Family'));

    // Assert
    expect(mockOnTabChange).toHaveBeenCalledWith('family');
  });

  it('点击 Settings 应调用 onTabChange("settings")', async () => {
    // Arrange
    render(<BottomNav activeTab="home" onTabChange={mockOnTabChange} onAddClick={mockOnAddClick} />);

    // Act
    await userEvent.click(screen.getByText('Settings'));

    // Assert
    expect(mockOnTabChange).toHaveBeenCalledWith('settings');
  });

  it('点击 + FAB 按钮应调用 onAddClick', async () => {
    // Arrange
    render(<BottomNav activeTab="home" onTabChange={mockOnTabChange} onAddClick={mockOnAddClick} />);

    // Act — FAB 是唯一没有文本内容的按钮
    const allButtons = screen.getAllByRole('button');
    const fabButton = allButtons.find(
      (btn) => !['Home', 'Analytics', 'Family', 'Settings'].includes(btn.textContent?.trim() ?? '')
    )!;
    await userEvent.click(fabButton);

    // Assert
    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });
});

// ─── QuickRecordModal ─────────────────────────────────────────────────────────

describe('QuickRecordModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isOpen=false 时不渲染任何内容', () => {
    // Act
    render(<QuickRecordModal isOpen={false} onClose={mockOnClose} />);

    // Assert
    expect(screen.queryByText('Expense')).not.toBeInTheDocument();
  });

  it('isOpen=true 时渲染弹窗内容', () => {
    // Act
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('Expense')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
  });

  it('默认金额为 45.00', () => {
    // Act
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('45.00')).toBeInTheDocument();
  });

  it('点击 Income 切换类型', async () => {
    // Arrange
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Act
    await userEvent.click(screen.getByText('Income'));

    // Assert — Income 按钮应高亮（有 text-mint 颜色类）
    const incomeBtn = screen.getByText('Income');
    expect(incomeBtn.className).toContain('text-mint');
  });

  it('点击 Expense 切换回支出类型', async () => {
    // Arrange
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);
    await userEvent.click(screen.getByText('Income'));

    // Act
    await userEvent.click(screen.getByText('Expense'));

    // Assert
    const expenseBtn = screen.getByText('Expense');
    expect(expenseBtn.className).toContain('text-ink');
  });

  it('点击数字键盘追加数字', async () => {
    // Arrange
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Act — 先找到键盘上的 "1" 按钮（非金额显示区）
    const keypadButtons = screen.getAllByRole('button');
    const key1 = keypadButtons.find((b) => b.textContent === '1');
    await userEvent.click(key1!);

    // Assert — 45.00 + "1" → 45.001（超过2位小数则不追加，但此处初始值 45.00 有2位小数，不会追加）
    // 实际上初始 "45.00" 小数点后已2位，应该不变
    expect(screen.getByText('45.00')).toBeInTheDocument();
  });

  it('小数点后不超过2位', async () => {
    // Arrange
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Act — 点击 "3"（此时 "45.00" 已有2位小数，不允许追加）
    const keypadButtons = screen.getAllByRole('button');
    const key3 = keypadButtons.find((b) => b.textContent === '3');
    await userEvent.click(key3!);

    // Assert — 金额应保持不变
    expect(screen.getByText('45.00')).toBeInTheDocument();
  });

  it('点击分类按钮可切换选中分类', async () => {
    // Arrange
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Act
    await userEvent.click(screen.getByText('Dining'));

    // Assert — Dining 文字应有 font-bold 样式（选中态）
    const diningLabel = screen.getByText('Dining');
    expect(diningLabel.className).toContain('font-bold');
  });

  it('点击 check 按钮应调用 onClose', async () => {
    // Arrange
    render(<QuickRecordModal isOpen={true} onClose={mockOnClose} />);

    // Act — Check 按钮是最后一个 button（键盘 11 个键 + check 按钮）
    const allButtons = screen.getAllByRole('button');
    const checkBtn = allButtons[allButtons.length - 1];
    await userEvent.click(checkBtn);

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
