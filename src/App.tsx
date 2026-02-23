/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { AnalyticsView } from './components/AnalyticsView';
import { FamilyView } from './components/FamilyView';
import { SettingsView } from './components/SettingsView';
import { BottomNav, QuickRecordModal } from './components/Navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'family':
        return <FamilyView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center">
      <div className="w-full max-w-md bg-canvas min-h-screen relative flex flex-col overflow-hidden shadow-2xl">
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
          onAddClick={() => setIsModalOpen(true)} 
        />

        <QuickRecordModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}
