import React from 'react';
import { Bell, ChevronRight, Lock, EyeOff, Fingerprint, Moon, Pin, Users, LogOut, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  isPrivacyUnlocked?: boolean;
  onOpenPrivacy?: () => void;
  onShowFxDemo?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isPrivacyUnlocked = false,
  onOpenPrivacy,
  onShowFxDemo,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between py-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-forest">Settings</h1>
        <button className="p-2 rounded-full hover:bg-mint/10 text-forest transition-colors">
          <Bell size={24} />
        </button>
      </header>

      {/* Profile Card */}
      <div className="bg-white rounded-[20px] shadow-sm p-5 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mint/20 to-transparent rounded-bl-full -mr-8 -mt-8" />
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            src="https://picsum.photos/seed/alex/200"
            alt="Profile"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-mint border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">✎</span>
          </div>
        </div>
        <div className="flex-1 z-10">
          <h2 className="font-display text-xl font-bold text-ink">Alex Johnson</h2>
          <p className="text-muted text-sm font-medium">alex.j@example.com</p>
        </div>
        <ChevronRight size={20} className="text-mint" />
      </div>

      {/* Privacy Zone */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-2">
          <Lock size={14} className="text-mint" />
          <h3 className="font-display text-sm font-bold text-forest tracking-wider uppercase">Privacy Zone</h3>
        </div>
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden divide-y divide-slate-50 border border-mint/10">
          {/* Hidden Ledger */}
          <button
            onClick={onOpenPrivacy}
            className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest group-hover:bg-mint/10 group-hover:text-mint transition-colors">
                <EyeOff size={20} />
              </div>
              <div>
                <p className="font-bold text-ink text-[15px]">Hidden Ledger</p>
                <p className={`text-[11px] font-medium flex items-center gap-1 ${isPrivacyUnlocked ? 'text-mint' : 'text-muted'}`}>
                  {isPrivacyUnlocked ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                      Unlocked
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                      Tap to unlock
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint size={20} className={isPrivacyUnlocked ? 'text-mint' : 'text-muted'} />
              <ChevronRight size={20} className="text-slate-200" />
            </div>
          </button>

          {/* Change PIN */}
          <button className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-muted">
                <Pin size={20} />
              </div>
              <p className="font-medium text-ink text-[15px]">Change App PIN</p>
            </div>
            <ChevronRight size={20} className="text-slate-200" />
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h3 className="font-display text-sm font-bold text-muted tracking-wider uppercase px-2 mb-2">Preferences</h3>
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden divide-y divide-slate-50">
          <button className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-ink">
                <Moon size={20} />
              </div>
              <p className="font-medium text-ink text-[15px]">Appearance</p>
            </div>
            <div className="flex items-center gap-1 text-muted">
              <span className="text-sm">Light</span>
              <ChevronRight size={20} className="text-slate-200" />
            </div>
          </button>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-ink">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-medium text-ink text-[15px]">Push Notifications</p>
                <p className="text-[11px] text-muted">Budget alerts & updates</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-mint rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-ink">
                <Users size={20} />
              </div>
              <p className="font-medium text-ink text-[15px]">Family Settings</p>
            </div>
            <ChevronRight size={20} className="text-slate-200" />
          </button>
        </div>
      </section>

      {/* Demo Controls — FX Fallback */}
      <section>
        <h3 className="font-display text-sm font-bold text-amber-500 tracking-wider uppercase px-2 mb-2">
          Demo Controls
        </h3>
        <div className="bg-amber-50 rounded-[20px] overflow-hidden border border-amber-100">
          <button
            onClick={onShowFxDemo}
            className="w-full text-left p-4 hover:bg-amber-100/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <RefreshCw size={20} />
              </div>
              <div>
                <p className="font-medium text-ink text-[15px]">Simulate FX Failure</p>
                <p className="text-[11px] text-amber-600">Triggers PRD §4.2.2 modal alert</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-amber-300" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <div className="pt-4 flex flex-col items-center gap-6 pb-4">
        <button className="text-red-500 font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-full hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Log Out
        </button>
        <div className="text-center space-y-1">
          <p className="text-xs text-muted font-mono">MintLedger v2.4.0 (Build 492)</p>
          <div className="flex justify-center gap-4 text-xs text-muted/60">
            <a className="hover:text-mint" href="#">Terms</a>
            <span>•</span>
            <a className="hover:text-mint" href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
