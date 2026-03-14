/**
 * Tests for getTodayLabel()
 * Skill: test-gen — AAA 模式
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTodayLabel } from '../components/HomeView';

describe('getTodayLabel()', () => {
  describe('返回结构', () => {
    it('应返回包含 weekday 和 dayMonth 的对象', () => {
      // Arrange — 使用真实系统时间

      // Act
      const result = getTodayLabel();

      // Assert
      expect(result).toHaveProperty('weekday');
      expect(result).toHaveProperty('dayMonth');
    });

    it('weekday 应为英文星期全称', () => {
      // Arrange
      const validWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      // Act
      const { weekday } = getTodayLabel();

      // Assert
      expect(validWeekdays).toContain(weekday);
    });

    it('dayMonth 应匹配 "Mon D" 或 "Mon DD" 格式', () => {
      // Act
      const { dayMonth } = getTodayLabel();

      // Assert — e.g. "Mar 5" or "Oct 24"
      expect(dayMonth).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
    });
  });

  describe('日期准确性', () => {
    beforeEach(() => {
      // 固定时间为 2024-10-24 周四
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-10-24T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('固定为 2024-10-24 时，weekday 应为 Thursday', () => {
      // Act
      const { weekday } = getTodayLabel();

      // Assert
      expect(weekday).toBe('Thursday');
    });

    it('固定为 2024-10-24 时，dayMonth 应为 Oct 24', () => {
      // Act
      const { dayMonth } = getTodayLabel();

      // Assert
      expect(dayMonth).toBe('Oct 24');
    });
  });

  describe('边界值', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('年初（Jan 1）应正确格式化', () => {
      // Arrange
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

      // Act
      const { dayMonth } = getTodayLabel();

      // Assert
      expect(dayMonth).toBe('Jan 1');
    });

    it('月末（Dec 31）应正确格式化', () => {
      // Arrange
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-12-31T00:00:00Z'));

      // Act
      const { dayMonth } = getTodayLabel();

      // Assert
      expect(dayMonth).toBe('Dec 31');
    });
  });
});
