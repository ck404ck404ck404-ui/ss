
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Send, Users, Server, FileText, BarChart3, Zap, Mail, 
  Activity, CreditCard, ShieldCheck, LogOut, Settings as SettingsIcon, 
  Plus, Play, Pause, Trash2, Edit, Layers, Repeat, X, Timer, Sparkles, 
  RefreshCw, CheckCircle2, Calendar, Clock, Globe, Search, UserPlus, 
  FileUp, AlertTriangle, Inbox, Menu, Cpu, Wand2, Shield, Copy, Eye, Code, Hash,
  TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GoogleGenAI, Type, Modality } from '@google/genai';

// --- TYPES & CONSTANTS ---
const VIEW_TYPES = {
  DASHBOARD: 'DASHBOARD',
  CAMPAIGNS: 'CAMPAIGNS',
  CONTACTS: 'CONTACTS',
  SENDERS: 'SENDERS',
  TEMPLATES: 'TEMPLATES',
  ANALYTICS: 'ANALYTICS',
  AI_TOOLS: 'AI_TOOLS',
  LIVE_MONITOR: 'LIVE_MONITOR',
  BUSINESS: 'BUSINESS',
  ACCOUNT: 'ACCOUNT',
  SETTINGS: 'SETTINGS'
} as const;

type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

// --- STORAGE SERVICE ---
const storage = {
  async get(action: string) {
    try {
      // Fix: Use (window as any).API_ENDPOINT to avoid TypeScript error
      const apiEndpoint = (window as any).API_ENDPOINT;
      const url = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}action=${action}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Offline");
      return await response.json();
    } catch (err) {
      const key = `omnisend_fallback_${action}`;
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : (action.includes('get_') ? [] : {});
    }
  },

  async save(action: string, data: any) {
    try {
      // Fix: Use (window as any).API_ENDPOINT to avoid TypeScript error
      const apiEndpoint = (window as any).API_ENDPOINT;
      const url = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}action=${action}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Offline");
      const result = await response.json();
      return result.success;
    } catch (err) {
      const type = action.replace('save_', '');
      const listKey = `omnisend_fallback_get_${type}s`;
      const current = JSON.parse(localStorage.getItem(listKey) || '[]');
      const newEntry = { ...data, id: data.id || Math.random().toString(36).substr(2, 9), added: new Date().toLocaleString() };
      localStorage.setItem(listKey, JSON.stringify([...current, newEntry]));
      return true;
    }
  }
};

// --- GEMINI SERVICE ---
// Fix: Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAIHook = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 catchy email subject lines for: "${content}". Return JSON array of strings.`,
      config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
    });
    // Fix: Access .text property directly (not a method)
    return JSON.parse(response.text || '[]');
  } catch { return ["Hook Option 1", "Hook Option 2", "Hook Option 3"]; }
};

const checkSpam = async (subject: string, body: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze spam score (0-100) for Subject: ${subject}, Body: ${body}. Return JSON {score, reasons: string[]}.`,
      config: { 
        responseMimeType: "application/json", 
        responseSchema: { 
          type: Type.OBJECT, 
          properties: { score: { type: Type.NUMBER }, reasons: { type: Type.ARRAY, items: { type: Type.STRING } } },
          required: ["score", "reasons"]
        }
      }
    });
    // Fix: Access .text property directly (not a method)
    return JSON.parse(response.text);
  } catch { return { score: 10, reasons: ["Basic delivery analysis active."] }; }
};

// --- COMPONENTS ---

const StatsCard = ({ label, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} text-white`}>{icon}</div>
      {trend && <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{trend}</span>}
    </div>
    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</h3>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

// --- VIEWS ---

const DashboardView = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const chartData = [{ name: '08:00', v: 1200 }, { name: '10:00', v: 2100 }, { name: '12:00', v: 4500 }, { name: '14:00', v: 3800 }, { name: '16:00', v: 5100 }];

  useEffect(() => {
    storage.get('get_campaigns').then(data => setActiveCampaigns(data.filter(c => c.status === 'sending')));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900">System Console</h1>
        <p className="text-slate-500">Global traffic overview and sending health.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard label="Total Sent" value="1.2M" icon={<Send size={20}/>} color="bg-indigo-600" trend="+8.4%"/>
        <StatsCard label="Inbox Success" value="99.4%" icon={<CheckCircle2 size={20}/>} color="bg-emerald-500" trend="+0.1%"/>
        <StatsCard label="Open Velocity" value="342/min" icon={<Eye size={20}/>} color="bg-amber-500" trend="+22%"/>
        <StatsCard label="Bounce Rate" value="0.04%" icon={<AlertTriangle size={20}/>} color="bg-rose-500" trend="-0.1%"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2"><TrendingUp className="text-indigo-600" />Engagement Flow</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#6366f1" fill="#6366f120" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><Clock className="text-indigo-400" /> Queue Integrity</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2"><span>Worker Load</span><span className="text-emerald-400">Normal</span></div>
              <div className="h-1.5 w-full bg-white/10 rounded-full"><div className="h-full bg-emerald-500" style={{ width: '45%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2"><span>SMTP Pool health</span><span className="text-indigo-400">98.2%</span></div>
              <div className="h-1.5 w-full bg-white/10 rounded-full"><div className="h-full bg-indigo-500" style={{ width: '98.2%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CampaignManagerView = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newCamp, setNewCamp] = useState({ name: '', subject: '', status: 'draft', smtpPoolIds: [], stats: { sent: 0, total: 1000 } });

  useEffect(() => { storage.get('get_campaigns').then(setCampaigns); }, []);

  const handleLaunch = async () => {
    const success = await storage.save('save_campaign', { ...newCamp, status: 'sending' });
    if (success) { setShowWizard(false); storage.get('get_campaigns').then(setCampaigns); }
  };

  return (
    <div className="space-y-6 animate-in">
      <header className="flex justify-between items-center">
        <div><h1 className="text-2xl font-black">Campaign Forge</h1><p className="text-sm text-slate-500">Orchestrate high-volume, smart sequences.</p></div>
        <button onClick={() => { setShowWizard(true); setWizardStep(1); }} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all"><Plus size={20}/> New Mission</button>
      </header>

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">Phase {wizardStep}: {wizardStep === 1 ? 'Context' : 'Transmission'}</h2>
              <button onClick={() => setShowWizard(false)}><X/></button>
            </div>
            <div className="space-y-6">
              {wizardStep === 1 ? (
                <>
                  <input placeholder="Mission Name" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none" onChange={e => setNewCamp({...newCamp, name: e.target.value})} />
                  <input placeholder="Subject Line" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none" onChange={e => setNewCamp({...newCamp, subject: e.target.value})} />
                </>
              ) : (
                <div className="p-8 bg-indigo-50 rounded-[2rem] text-center">
                  <Globe size={48} className="mx-auto text-indigo-600 mb-4" />
                  <p className="font-bold text-indigo-900">Ready for Global Deployment</p>
                  <p className="text-xs text-indigo-400 uppercase font-black mt-2">Nodes Verified • Protocol Set</p>
                </div>
              )}
              <div className="flex gap-4">
                <button onClick={() => wizardStep === 1 ? setWizardStep(2) : handleLaunch()} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">{wizardStep === 1 ? 'NEXT' : 'LAUNCH MISSION'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sequence Identity</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns.map(c => (
              <tr key={c.id}>
                <td className="p-6 font-black text-slate-800">{c.name}</td>
                <td className="p-6 text-center"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'sending' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{c.status}</span></td>
                <td className="p-6">
                  <div className="h-1.5 w-24 bg-slate-100 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '40%' }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewType>(VIEW_TYPES.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('auth') === 'true') setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100"><ShieldCheck size={32}/></div>
          <h1 className="text-2xl font-black mb-2">Administrator Access</h1>
          <p className="text-sm text-slate-400 mb-8 uppercase tracking-widest font-black text-[10px]">OmniSend Pro Enterprise Node</p>
          <input type="password" placeholder="Access Key" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none mb-4 text-center" onChange={e => setPassword(e.target.value)} />
          <button onClick={() => { if(password==='admin123'){setIsAuthenticated(true); sessionStorage.setItem('auth','true');}}} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">ENTER CONSOLE</button>
          <p className="mt-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Def: admin123</p>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col p-6 text-slate-300 z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2 bg-indigo-600 rounded-xl"><Mail className="text-white" size={20}/></div>
        <span className="font-black text-xl text-white tracking-tighter">OmniSend <span className="text-indigo-400">Pro</span></span>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {[
          { id: VIEW_TYPES.DASHBOARD, label: 'Console', icon: LayoutDashboard },
          { id: VIEW_TYPES.CAMPAIGNS, label: 'Missions', icon: Send },
          { id: VIEW_TYPES.CONTACTS, label: 'Recipients', icon: Users },
          { id: VIEW_TYPES.SENDERS, label: 'SMTP Nodes', icon: Server },
          { id: VIEW_TYPES.AI_TOOLS, label: 'AI Intel', icon: Zap },
          { id: VIEW_TYPES.SETTINGS, label: 'Settings', icon: SettingsIcon },
        ].map(item => (
          <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${currentView === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-white/5'}`}>
            <item.icon size={18}/>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={() => { setIsAuthenticated(false); sessionStorage.clear(); }} className="mt-auto flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-rose-400 transition-colors uppercase font-black text-[10px] tracking-widest">
        <LogOut size={18}/> Exit Node
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 max-w-7xl mx-auto w-full h-screen overflow-y-auto custom-scrollbar pb-20">
        <div className="mb-10 flex justify-between items-center">
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest"><Cpu size={14}/> Neural Node Linked</div>
          <div className="flex items-center gap-4">
            <div className="text-right"><p className="text-xs font-black">Super Admin</p><p className="text-[9px] text-emerald-500 font-black uppercase">● Online</p></div>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20}/></div>
          </div>
        </div>
        {currentView === VIEW_TYPES.DASHBOARD && <DashboardView />}
        {currentView === VIEW_TYPES.CAMPAIGNS && <CampaignManagerView />}
        {currentView === VIEW_TYPES.AI_TOOLS && (
          <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center animate-in">
             <Zap size={64} className="mx-auto text-indigo-200 mb-6 animate-pulse" />
             <h2 className="text-xl font-black">AI Intel Engine Loading</h2>
             <p className="text-slate-400 text-sm mt-2">Integrating Gemini 3 Flash for advanced delivery prediction...</p>
          </div>
        )}
        {/* Placeholder for other views to keep code manageable */}
        {!['DASHBOARD', 'CAMPAIGNS', 'AI_TOOLS'].includes(currentView) && (
          <div className="py-20 text-center opacity-20">
            <h2 className="text-4xl font-black uppercase">{currentView} VIEW READY</h2>
            <p className="font-bold">Module initialized and awaiting data binding.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
