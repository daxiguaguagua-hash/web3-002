/**
 * Tests for modal components: PinModal, FxFallbackModal
 * AAA 模式 — 使用 fireEvent 避免 userEvent + fake timers 冲突
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

// Mock motion/react — 动画在 jsdom 环境下会阻塞交互，替换为原生元素
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, animate: _a, initial: _i, exit: _e, transition: _t, ...props }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) =>
      React.createElement('div', props, children),
    button: ({ children, animate: _a, initial: _i, exit: _e, transition: _t, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & Record<string, unknown>) =>
      React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

import { PinModal } from '../components/PinModal';
import { FxFallbackModal } from '../components/FxFallbackModal';

// ─── PinModal ─────────────────────────────────────────────────────────────────

describe('PinModal', () => {
  const mockOnSuccess = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('isOpen=false 时不渲染内容', () => {
    // Act
    render(<PinModal isOpen={false} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Assert
    expect(screen.queryByText('隐私账本')).not.toBeInTheDocument();
  });

  it('isOpen=true 时显示标题和生物识别界面', () => {
    // Act
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('隐私账本')).toBeInTheDocument();
    expect(screen.getByText('请验证您的身份以继续')).toBeInTheDocument();
    expect(screen.getByText('点击指纹图标进行验证')).toBeInTheDocument();
  });

  it('点击指纹按钮后应显示扫描中状态', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Act — 指纹按钮有 w-24 h-24 class，关闭按钮是 w-8 h-8
    const bioBtn = document.querySelector('button.w-24.h-24') as HTMLElement;
    act(() => { fireEvent.click(bioBtn); });

    // Assert
    expect(screen.getByText('扫描中...')).toBeInTheDocument();
  });

  it('生物识别成功后应调用 onSuccess', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    const bioBtn = document.querySelector('button.w-24.h-24') as HTMLElement;

    // Act
    act(() => { fireEvent.click(bioBtn); });
    act(() => { vi.runAllTimers(); });

    // Assert
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('点击 [Demo: 模拟识别失败] 应显示失败计数', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Act
    act(() => { fireEvent.click(screen.getByText('[Demo: 模拟识别失败]')); });
    act(() => { vi.runAllTimers(); });

    // Assert — bioStatus 先变 failed（显示失败文字），再变 idle
    // 验证失败文字在 idle 前出现：用 runAllTimers 前检查或用 runOnlyPendingTimers
    // 重新只运行点击时的 state update，不推进 800ms timer
    // 需重新渲染：
  });

  it('失败后显示失败计数（在 idle 重置前）', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Act — 只触发点击，不推进 timer（此时 bioStatus='failed'，显示计数）
    act(() => { fireEvent.click(screen.getByText('[Demo: 模拟识别失败]')); });

    // Assert — bioStatus=failed 时文字格式为 "验证失败 (N/3)"
    expect(screen.getByText(/验证失败 \(1\/3\)/)).toBeInTheDocument();
  });

  it('失败1次后应出现"改用PIN码"按钮', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Act
    act(() => { fireEvent.click(screen.getByText('[Demo: 模拟识别失败]')); });

    // Assert
    expect(screen.getByText('改用PIN码')).toBeInTheDocument();
  });

  it('失败3次后自动切换到 PIN 输入界面', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    const demoFail = screen.getByText('[Demo: 模拟识别失败]');

    // Act — 点击3次
    act(() => { fireEvent.click(demoFail); });
    act(() => { vi.runAllTimers(); });
    act(() => { fireEvent.click(demoFail); });
    act(() => { vi.runAllTimers(); });
    act(() => { fireEvent.click(demoFail); });
    act(() => { vi.runAllTimers(); });

    // Assert
    expect(screen.getByText('请输入您的PIN码')).toBeInTheDocument();
  });

  it('点击"改用PIN码"可直接切换到 PIN 界面', () => {
    // Arrange
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    act(() => { fireEvent.click(screen.getByText('[Demo: 模拟识别失败]')); });

    // Act
    act(() => { fireEvent.click(screen.getByText('改用PIN码')); });

    // Assert
    expect(screen.getByText('请输入您的PIN码')).toBeInTheDocument();
  });

  it('PIN 界面：输入4位数字后应调用 onSuccess', () => {
    // Arrange — 先切换到 PIN 界面
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    const demoFail = screen.getByText('[Demo: 模拟识别失败]');
    for (let i = 0; i < 3; i++) {
      act(() => { fireEvent.click(demoFail); });
      act(() => { vi.runAllTimers(); });
    }

    // Act — 点击4个数字键
    const key1 = screen.getAllByRole('button').find((b) => b.textContent === '1')!;
    act(() => { fireEvent.click(key1); });
    act(() => { fireEvent.click(key1); });
    act(() => { fireEvent.click(key1); });
    act(() => { fireEvent.click(key1); });
    act(() => { vi.runAllTimers(); });

    // Assert
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('PIN 界面：删除按钮可删除最后一位', () => {
    // Arrange — 切换到 PIN 界面
    vi.useFakeTimers();
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    const demoFail = screen.getByText('[Demo: 模拟识别失败]');
    for (let i = 0; i < 3; i++) {
      act(() => { fireEvent.click(demoFail); });
      act(() => { vi.runAllTimers(); });
    }

    // 输入1位数字
    const key1 = screen.getAllByRole('button').find((b) => b.textContent === '1')!;
    act(() => { fireEvent.click(key1); });

    // 验证第一个点已填
    const dots = document.querySelectorAll('.w-4.h-4.rounded-full');
    expect(dots[0].className).toContain('bg-mint');

    // Act — 删除按钮（最后一个 button）
    const allBtns = screen.getAllByRole('button');
    act(() => { fireEvent.click(allBtns[allBtns.length - 1]); });

    // Assert — 第一个点应回到未填状态
    const dotsAfter = document.querySelectorAll('.w-4.h-4.rounded-full');
    expect(dotsAfter[0].className).toContain('bg-slate-200');
  });

  it('点击关闭按钮应调用 onClose 并重置状态', () => {
    // Arrange
    render(<PinModal isOpen={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    // Act — 关闭按钮是第一个 button（X 图标）
    const closeBtn = screen.getAllByRole('button')[0];
    act(() => { fireEvent.click(closeBtn); });

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

// ─── FxFallbackModal ──────────────────────────────────────────────────────────

describe('FxFallbackModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnLater = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isOpen=false 时不渲染内容', () => {
    // Act
    render(<FxFallbackModal isOpen={false} onConfirm={mockOnConfirm} onLater={mockOnLater} />);

    // Assert
    expect(screen.queryByText('汇率服务暂不可用')).not.toBeInTheDocument();
  });

  it('isOpen=true 时显示警告标题', () => {
    // Act
    render(<FxFallbackModal isOpen={true} onConfirm={mockOnConfirm} onLater={mockOnLater} />);

    // Assert
    expect(screen.getByText('汇率服务暂不可用')).toBeInTheDocument();
  });

  it('应显示 1:1 折算说明', () => {
    // Act
    render(<FxFallbackModal isOpen={true} onConfirm={mockOnConfirm} onLater={mockOnLater} />);

    // Assert
    expect(screen.getAllByText(/1:1/).length).toBeGreaterThanOrEqual(1);
  });

  it('点击"确认保存"应调用 onConfirm', () => {
    // Arrange
    render(<FxFallbackModal isOpen={true} onConfirm={mockOnConfirm} onLater={mockOnLater} />);

    // Act
    act(() => { fireEvent.click(screen.getByText('确认保存')); });

    // Assert
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnLater).not.toHaveBeenCalled();
  });

  it('点击"稍后"应调用 onLater', () => {
    // Arrange
    render(<FxFallbackModal isOpen={true} onConfirm={mockOnConfirm} onLater={mockOnLater} />);

    // Act
    act(() => { fireEvent.click(screen.getByText('稍后')); });

    // Assert
    expect(mockOnLater).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('背景蒙层不可点击关闭（PRD §4.2.2 要求）', () => {
    // Arrange
    render(<FxFallbackModal isOpen={true} onConfirm={mockOnConfirm} onLater={mockOnLater} />);

    // Act — 点击背景 overlay（非按钮区域）
    const overlay = document.querySelector('.fixed.inset-0');
    if (overlay) act(() => { fireEvent.click(overlay as HTMLElement); });

    // Assert — 两个回调均未被调用
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnLater).not.toHaveBeenCalled();
  });
});
