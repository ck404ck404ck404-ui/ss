import React from 'react';
import { 
  LayoutDashboard, Send, Users, Server, FileText, BarChart3, Zap, Mail, Activity, CreditCard, ShieldCheck, LogOut
} from 'lucide-react';
import { ViewType, VIEW_TYPES } from '../types.ts';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: VIEW_TYPES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: VIEW_TYPES.LIVE_MONITOR, label: 'Live Monitor', icon: Activity, pulse: true },
    { id: VIEW_TYPES.CAMPAIGNS, label: 'Campaigns', icon: Send },
    { id: VIEW_TYPES.CONTACTS, label: 'Contacts', icon: Users },
    { id: VIEW_TYPES.SENDERS, label: 'SMTP Senders', icon: Server },
    { id: VIEW_TYPES.TEMPLATES, label: 'Templates', icon: FileText },
    { id: VIEW_TYPES.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: VIEW_TYPES.AI_TOOLS, label: 'AI Optimizer', icon: Zap },
    { id: VIEW_TYPES.BUSINESS, label: 'Business Center', icon: CreditCard },
    { id: VIEW_TYPES.ACCOUNT, label: 'Security & Account', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('omnisend_is_authenticated');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-slate-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Mail className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">OmniSend <span className="text-indigo-400">Pro</span></span>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={item.pulse && !isActive ? "text-indigo-400 animate-pulse" : ""} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-sm font-bold">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
