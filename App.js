
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './views/Dashboard.tsx';
import CampaignManager from './views/CampaignManager.tsx';
import AIOptimizer from './views/AIOptimizer.tsx';
import SenderManagement from './views/SenderManagement.tsx';
import ContactManager from './views/ContactManager.tsx';
import TemplateManager from './views/TemplateManager.tsx';
import LiveMonitor from './views/LiveMonitor.tsx';
import Analytics from './views/Analytics.tsx';
import BusinessCenter from './views/BusinessCenter.tsx';
import AccountSettings from './views/AccountSettings.tsx';
import Settings from './views/Settings.tsx';
import Login from './views/Login.tsx';
import LiveAssistant from './components/LiveAssistant.tsx';
import { VIEW_TYPES } from './types.ts';
import { Menu, X, Cpu, ShieldCheck } from 'lucide-react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState(VIEW_TYPES.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('omnisend_is_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case VIEW_TYPES.DASHBOARD: return <Dashboard />;
      case VIEW_TYPES.LIVE_MONITOR: return <LiveMonitor />;
      case VIEW_TYPES.CAMPAIGNS: return <CampaignManager />;
      case VIEW_TYPES.CONTACTS: return <ContactManager />;
      case VIEW_TYPES.AI_TOOLS: return <AIOptimizer />;
      case VIEW_TYPES.SENDERS: return <SenderManagement />;
      case VIEW_TYPES.TEMPLATES: return <TemplateManager />;
      case VIEW_TYPES.ANALYTICS: return <Analytics />;
      case VIEW_TYPES.BUSINESS: return <BusinessCenter />;
      case VIEW_TYPES.ACCOUNT: return <AccountSettings />;
      case VIEW_TYPES.SETTINGS: return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden lg:block shrink-0">
        <Sidebar currentView={currentView} setView={setCurrentView} />
      </div>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 h-full bg-slate-900 shadow-2xl">
             <Sidebar currentView={currentView} setView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} />
             <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-[-48px] p-2 bg-indigo-600 text-white rounded-lg">
               <X size={24} />
             </button>
          </div>
        </div>
      )}

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full overflow-hidden">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              <Cpu size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Neural Node</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">Super Admin</p>
              <div className="text-[10px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1.5 tracking-tighter">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM NOMINAL
              </div>
            </div>
            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full flex-1 overflow-y-auto custom-scrollbar">
          {renderView()}
        </div>
        
        <LiveAssistant />
      </main>
    </div>
  );
};

export default App;
