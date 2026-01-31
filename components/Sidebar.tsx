
import React from 'react';
import { 
  LayoutDashboard, Send, Users, Server, FileText, BarChart3, Zap, Mail, Activity, CreditCard, ShieldCheck, LogOut, Settings
} from 'lucide-react';
import { ViewType, VIEW_TYPES } from '../types.ts';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: VIEW_TYPES.DASHBOARD, label: 'Console', icon: LayoutDashboard },
    { id: VIEW_TYPES.LIVE_MONITOR, label: 'Live Monitor', icon: Activity, pulse: true },
    { id: VIEW_TYPES.CAMPAIGNS, label: 'Missions', icon: Send },
    { id: VIEW_TYPES.CONTACTS, label: 'Recipients', icon: Users },
    { id: VIEW_TYPES.SENDERS, label: 'SMTP Nodes', icon: Server },
    { id: VIEW_TYPES.TEMPLATES, label: 'Library', icon: FileText },
    { id: VIEW_TYPES.ANALYTICS, label: 'Deliverability', icon: BarChart3 },
    { id: VIEW_TYPES.AI_TOOLS, label: 'AI Intel', icon: Zap },
    { id: VIEW_TYPES.BUSINESS, label: 'SaaS Center', icon: CreditCard },
    { id: VIEW_TYPES.ACCOUNT, label: 'Security', icon: ShieldCheck },
    { id: VIEW_TYPES.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('omnisend_is_authenticated');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-slate-300">
      <div className="p-8 flex items-center gap-4 border-b border-white/5">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/30">
          <Mail className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter">OmniSend <span className="text-indigo-400">Pro</span></span>
      </div>
      
      <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto custom-scrollbar pb-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={item.pulse && !isActive ? "text-indigo-400 animate-pulse" : ""} />
              <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest">
          <LogOut size={16} />
          Exit
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
