/**
 * Tests for SettingsView component
 * AAA 模式
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsView } from '../components/SettingsView';

describe('SettingsView', () => {
  const mockOnOpenPrivacy = vi.fn();
  const mockOnShowFxDemo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应渲染 Settings 标题', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('应渲染用户名和邮箱', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.getByText('alex.j@example.com')).toBeInTheDocument();
  });

  it('应渲染 Hidden Ledger 选项', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Hidden Ledger')).toBeInTheDocument();
  });

  it('isPrivacyUnlocked=false（默认）时应显示 "Tap to unlock"', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Tap to unlock')).toBeInTheDocument();
    expect(screen.queryByText('Unlocked')).not.toBeInTheDocument();
  });

  it('isPrivacyUnlocked=true 时应显示 "Unlocked"', () => {
    // Act
    render(<SettingsView isPrivacyUnlocked={true} />);

    // Assert
    expect(screen.getByText('Unlocked')).toBeInTheDocument();
    expect(screen.queryByText('Tap to unlock')).not.toBeInTheDocument();
  });

  it('点击 Hidden Ledger 应调用 onOpenPrivacy', async () => {
    // Arrange
    render(<SettingsView onOpenPrivacy={mockOnOpenPrivacy} />);

    // Act
    await userEvent.click(screen.getByText('Hidden Ledger'));

    // Assert
    expect(mockOnOpenPrivacy).toHaveBeenCalledTimes(1);
  });

  it('应渲染 Demo Controls 区域', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Demo Controls')).toBeInTheDocument();
    expect(screen.getByText('Simulate FX Failure')).toBeInTheDocument();
  });

  it('点击 Simulate FX Failure 应调用 onShowFxDemo', async () => {
    // Arrange
    render(<SettingsView onShowFxDemo={mockOnShowFxDemo} />);

    // Act
    await userEvent.click(screen.getByText('Simulate FX Failure'));

    // Assert
    expect(mockOnShowFxDemo).toHaveBeenCalledTimes(1);
  });

  it('应渲染 Preferences 区域', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Family Settings')).toBeInTheDocument();
  });

  it('应渲染版本号', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText(/MintLedger v2.4.0/)).toBeInTheDocument();
  });

  it('应渲染 Log Out 按钮', () => {
    // Act
    render(<SettingsView />);

    // Assert
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });
});
