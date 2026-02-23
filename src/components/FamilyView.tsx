import React from 'react';
import { ArrowLeft, Bell, Edit, Plus, Eye, EyeOff, Wallet, Share, Trash2 } from 'lucide-react';
import { MOCK_FAMILY_MEMBERS } from '../constants';

export const FamilyView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft size={28} />
          </button>
          <h1 className="font-display font-bold text-2xl tracking-tight">Family Hub</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100 relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-canvas"></span>
        </button>
      </header>

      <section className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-br from-mint to-forest"></div>
        <div className="relative h-full flex flex-col justify-end p-6 z-10">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-medium w-fit mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse"></span>
                Active Budget
              </span>
              <h2 className="text-white font-display text-3xl font-bold leading-tight">The Smiths</h2>
              <p className="text-white/80 font-medium text-sm mt-1">4 Members • Combined Budget Active</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Edit size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">Members</h3>
          <button className="text-mint text-sm font-medium">Manage Roles</button>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
          {MOCK_FAMILY_MEMBERS.map((member) => (
            <div key={member.id} className="shrink-0 w-[140px] bg-white rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm border border-slate-100 relative">
              {member.status === 'online' && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-mint rounded-full ring-2 ring-white"></div>
              )}
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${member.role === 'Admin' ? 'border-mint/20' : 'border-slate-100'} p-0.5`}>
                <img alt={member.name} className="w-full h-full object-cover rounded-full" src={member.avatar} referrerPolicy="no-referrer" />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-ink text-base">{member.name}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                  member.role === 'Admin' ? 'text-mint bg-mint/10' : 'text-muted bg-slate-100'
                }`}>
                  {member.role}
                </p>
              </div>
            </div>
          ))}
          <button className="shrink-0 w-[140px] h-[168px] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-muted group-hover:text-mint transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-medium text-xs text-muted group-hover:text-mint">Add New</span>
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg font-semibold text-ink">Global Permissions</h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                <EyeOff size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-ink text-[15px]">View Hidden Ledger</span>
                <span className="text-xs text-muted leading-tight">Allow members to see private assets</span>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-slate-200 relative transition-colors">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></span>
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-mint/10 flex items-center justify-center text-mint">
                <Wallet size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-ink text-[15px]">Edit Shared Budget</span>
                <span className="text-xs text-muted leading-tight">Admins can modify monthly limits</span>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-mint relative transition-colors">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></span>
            </button>
          </div>
        </div>
        
        <button className="mt-4 w-full py-4 px-6 text-red-500 font-bold text-sm flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
          <Trash2 size={18} />
          Delete Family Group
        </button>
      </section>
    </div>
  );
};
