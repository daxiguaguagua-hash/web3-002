/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MintLedger — Web Demo Entry Point
 * PRD §5: Web端仅展示/演示，不登录、不接真实用户数据、不请求账本后端
 */

import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { AnalyticsView } from './components/AnalyticsView';
import { FamilyView } from './components/FamilyView';
import { SettingsView } from './components/SettingsView';
import { BottomNav, QuickRecordModal } from './components/Navigation';
import { PhoneFrame } from './components/PhoneFrame';
import { PinModal } from './components/PinModal';
import { FxFallbackModal } from './components/FxFallbackModal';
import { motion, AnimatePresence } from 'motion/react';
import { APP_MODE } from './config/mode';

// ─── App Shell (inside phone frame) ─────────────────────────────────────────

function AppShell() {
  const [activeTab, setActiveTab] = useState('home');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isPrivacyUnlocked, setIsPrivacyUnlocked] = useState(false);
  const [isFxModalOpen, setIsFxModalOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'analytics': return <AnalyticsView />;
      case 'family': return <FamilyView />;
      case 'settings':
        return (
          <SettingsView
            isPrivacyUnlocked={isPrivacyUnlocked}
            onOpenPrivacy={() => {
              if (!isPrivacyUnlocked) setIsPinOpen(true);
            }}
            onShowFxDemo={() => setIsFxModalOpen(true)}
          />
        );
      default: return <HomeView />;
    }
  };

  return (
    <div className="w-full h-full bg-canvas flex flex-col relative overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsRecordOpen(true)}
      />

      <QuickRecordModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
      />

      <PinModal
        isOpen={isPinOpen}
        onSuccess={() => {
          setIsPinOpen(false);
          setIsPrivacyUnlocked(true);
        }}
        onClose={() => setIsPinOpen(false)}
      />

      <FxFallbackModal
        isOpen={isFxModalOpen}
        onConfirm={() => setIsFxModalOpen(false)}
        onLater={() => setIsFxModalOpen(false)}
      />
    </div>
  );
}

// ─── Web Landing Page ────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start"
      style={{
        background: 'linear-gradient(135deg, #f0fdf8 0%, #e6f7f2 40%, #f7f9f8 100%)',
      }}
    >
      {/* Mode badge */}
      <div className="fixed top-4 right-4 z-50">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          APP_MODE === 'mock' ? 'bg-amber-100 text-amber-700' :
          APP_MODE === 'dev' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {APP_MODE} mode
        </span>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 text-mint text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            Personal Finance
          </div>

          <h1
            className="text-5xl lg:text-6xl font-bold text-forest leading-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Money made
            <br />
            <span className="text-mint">simple.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-md mb-10 leading-relaxed">
            Track expenses, manage family budgets, and stay private — all in one beautifully minimal app.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest text-white font-semibold rounded-2xl hover:bg-forest/90 transition-colors shadow-lg shadow-forest/20"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download for iOS
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-forest font-semibold rounded-2xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.66.19.99.03l13.12-7.38-2.8-2.8-11.31 10.15zM.5 1.41C.19 1.76 0 2.3 0 3.01v17.98c0 .71.19 1.25.5 1.6l.08.08L10.12 12v-.24L.58 1.33l-.08.08zM20.35 10.28l-2.86-1.61-3.2 3.2 3.2 3.2 2.89-1.63c.82-.46.82-1.22-.03-1.68v.01-.49zM3.18.24L16.3 7.62l-2.8 2.8L3.18.32V.24z"/>
              </svg>
              Download for Android
            </a>
          </div>
        </motion.div>

        {/* Right: Phone */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-shrink-0"
        >
          <PhoneFrame>
            <AppShell />
          </PhoneFrame>
        </motion.div>
      </section>

      {/* Feature highlights */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { emoji: '⚡', title: '5-Second Entry', desc: 'Record any transaction in under 5 seconds with smart autocomplete.' },
          { emoji: '👨‍👩‍👧', title: 'Family Sharing', desc: 'Shared budgets with role-based permissions for every family member.' },
          { emoji: '🔒', title: 'Privacy First', desc: 'Hidden ledger with biometric lock. Fully offline capable.' },
        ].map((f) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white"
          >
            <div className="text-3xl mb-3">{f.emoji}</div>
            <h3 className="font-bold text-forest mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 py-6 text-center">
        <p className="text-xs text-slate-400">
          MintLedger v2.4.0 · Web Demo Only · No real data is collected or stored
        </p>
      </footer>
    </div>
  );
}
