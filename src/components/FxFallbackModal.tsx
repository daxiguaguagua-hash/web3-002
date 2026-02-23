import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface FxFallbackModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onLater: () => void;
}

/**
 * PRD §4.2.2 — 汇率失败回退模态弹窗
 * 当汇率服务不可用且无缓存时，必须弹出此模态弹窗。
 * 用户必须点击"确认"或"稍后"才能完成保存。
 * 不可关闭背景蒙层绕过此弹窗。
 */
export const FxFallbackModal: React.FC<FxFallbackModalProps> = ({
  isOpen,
  onConfirm,
  onLater,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景蒙层 — 不可点击关闭（PRD要求用户必须主动确认） */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          {/* 弹窗主体 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-6"
          >
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* 顶部警告区域 */}
              <div className="bg-amber-50 px-6 pt-8 pb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <AlertTriangle size={32} className="text-amber-500" />
                </div>
                <h2 className="font-display text-lg font-bold text-ink mb-2">
                  汇率服务暂不可用
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  已使用 <span className="font-bold text-ink">1:1</span> 折算。请稍后联网手动刷新汇率。
                </p>
              </div>

              {/* 说明区域 */}
              <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100">
                <p className="text-xs text-muted text-center leading-relaxed">
                  此笔交易将以 1:1 汇率记录。历史报表不受影响，汇率刷新后可手动更正。
                </p>
              </div>

              {/* 按钮区域 */}
              <div className="flex divide-x divide-slate-100 border-t border-slate-100">
                <button
                  onClick={onLater}
                  className="flex-1 py-4 text-sm font-medium text-muted hover:bg-slate-50 transition-colors"
                >
                  稍后
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-4 text-sm font-bold text-mint hover:bg-mint/5 transition-colors"
                >
                  确认保存
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
