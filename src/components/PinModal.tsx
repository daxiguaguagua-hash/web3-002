import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, X, Delete } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

/**
 * PRD §4.6 — 隐私账本解锁
 * 模拟流程：生物识别（直接成功） → 失败3次后 → PIN输入框
 * Demo模式：任意4位数字即可解锁
 */
export const PinModal: React.FC<PinModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [phase, setPhase] = useState<'biometric' | 'pin'>('biometric');
  const [pin, setPin] = useState('');
  const [bioFailCount, setBioFailCount] = useState(0);
  const [error, setError] = useState('');
  const [bioStatus, setBioStatus] = useState<'idle' | 'scanning' | 'failed'>('idle');

  const handleBioScan = () => {
    setBioStatus('scanning');
    setTimeout(() => {
      // Demo: simulate success on first try
      setBioStatus('idle');
      onSuccess();
      resetState();
    }, 1200);
  };

  const handleBioFail = () => {
    const newCount = bioFailCount + 1;
    setBioFailCount(newCount);
    setBioStatus('failed');
    setTimeout(() => setBioStatus('idle'), 800);
    if (newCount >= 3) {
      setPhase('pin');
    }
  };

  const handleKeyPress = (key: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    setError('');
    if (newPin.length === 4) {
      setTimeout(() => {
        // Demo: any 4-digit PIN works
        if (newPin.length === 4) {
          onSuccess();
          resetState();
        } else {
          setError('PIN错误，请重试');
          setPin('');
        }
      }, 300);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError('');
  };

  const resetState = () => {
    setPin('');
    setPhase('biometric');
    setBioFailCount(0);
    setError('');
    setBioStatus('idle');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 z-[101] flex items-end justify-center"
          >
            <div className="w-full max-w-md bg-white rounded-t-[40px] shadow-2xl pb-10">
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-muted"
              >
                <X size={16} />
              </button>

              <div className="px-8 pt-4 pb-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h2 className="font-display text-xl font-bold text-ink">隐私账本</h2>
                <p className="text-sm text-muted mt-1">
                  {phase === 'biometric' ? '请验证您的身份以继续' : '请输入您的PIN码'}
                </p>
              </div>

              {phase === 'biometric' ? (
                <div className="flex flex-col items-center gap-6 px-8">
                  {/* Biometric button */}
                  <motion.button
                    onClick={handleBioScan}
                    animate={
                      bioStatus === 'scanning'
                        ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }
                        : bioStatus === 'failed'
                        ? { x: [-6, 6, -6, 6, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                      bioStatus === 'failed'
                        ? 'bg-red-50 text-red-400'
                        : 'bg-mint/10 text-mint hover:bg-mint/20'
                    }`}
                  >
                    <Fingerprint size={48} />
                  </motion.button>

                  <p className="text-xs text-muted">
                    {bioStatus === 'scanning'
                      ? '扫描中...'
                      : bioStatus === 'failed'
                      ? `验证失败 (${bioFailCount}/3)`
                      : '点击指纹图标进行验证'}
                  </p>

                  {bioFailCount > 0 && bioFailCount < 3 && (
                    <button
                      onClick={() => setPhase('pin')}
                      className="text-sm text-mint font-medium underline"
                    >
                      改用PIN码
                    </button>
                  )}

                  {/* Demo helper */}
                  <button
                    onClick={handleBioFail}
                    className="text-xs text-slate-300 mt-2"
                  >
                    [Demo: 模拟识别失败]
                  </button>
                </div>
              ) : (
                <div className="px-8">
                  {/* PIN dots */}
                  <div className="flex justify-center gap-4 mb-8">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: pin.length > i ? 1.2 : 1 }}
                        className={`w-4 h-4 rounded-full transition-colors ${
                          pin.length > i ? 'bg-mint' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-center text-xs text-red-500 mb-4">{error}</p>
                  )}

                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-3">
                    {keypad.map((key, idx) => (
                      <button
                        key={idx}
                        onClick={() => key && handleKeyPress(key)}
                        className={`h-14 rounded-2xl text-xl font-display font-semibold transition-all ${
                          key
                            ? 'bg-slate-50 text-ink hover:bg-slate-100 active:scale-95'
                            : 'pointer-events-none'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                    <button
                      onClick={handleDelete}
                      className="h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-muted hover:bg-slate-100 active:scale-95 transition-all"
                    >
                      <Delete size={20} />
                    </button>
                  </div>

                  <p className="text-center text-xs text-muted mt-6">
                    [Demo模式：任意4位数字可解锁]
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
