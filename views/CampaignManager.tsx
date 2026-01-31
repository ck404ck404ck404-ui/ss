
import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Pause, Trash2, Edit, Zap, Layers, Repeat, ShieldCheck, 
  X, Server, Timer, Sparkles, RefreshCw, CheckCircle2, Calendar, Clock, Globe
} from 'lucide-react';
import { Campaign, SMTPServer } from '../types';
import { storage } from '../services/storageService.ts';

const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [availableSenders, setAvailableSenders] = useState<SMTPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    subject: '',
    body: '',
    isWarmup: false,
    useRandomDelay: true,
    smtpPoolIds: [],
    sendingSpeed: 50,
    scheduledAt: new Date().toISOString().slice(0, 16),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    stats: { sent: 0, failed: 0, opened: 0, clicked: 0, total: 1000 }
  });

  useEffect(() => { load(); loadSenders(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await storage.get('get_campaigns');
    setCampaigns(data || []);
    setLoading(false);
  };

  const loadSenders = async () => {
    const data = await storage.get('get_senders');
    setAvailableSenders(data || []);
  };

  const handleLaunch = async () => {
    if (!newCampaign.name || !newCampaign.subject) return alert("Missing info");
    setLoading(true);
    const success = await storage.save('save_campaign', { 
      ...newCampaign, 
      status: 'sending',
      id: Math.random().toString(36).substr(2, 9)
    });
    if (success) { setShowWizard(false); load(); }
    setLoading(false);
  };

  const toggleSender = (id: string) => {
    const current = [...(newCampaign.smtpPoolIds || [])];
    setNewCampaign({
      ...newCampaign,
      smtpPoolIds: current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Campaign Forge</h1>
          <p className="text-slate-500">Orchestrate high-volume, smart sequences.</p>
        </div>
        <button 
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          <span>New Mission</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Active Now</p>
            <p className="text-4xl font-black">{campaigns.filter(c => c.status === 'sending').length}</p>
          </div>
          <Zap size={60} className="absolute right-[-10px] top-[-10px] text-white/10 group-hover:scale-125 transition-transform" />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Global Inboxing</p>
            <p className="text-4xl font-black text-emerald-500">99.2%</p>
          </div>
          <ShieldCheck size={32} className="text-emerald-500" />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Total Nodes</p>
            <p className="text-4xl font-black text-slate-900">{availableSenders.length}</p>
          </div>
          <Server size={32} className="text-indigo-600" />
        </div>
      </div>

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">
                  {wizardStep}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {wizardStep === 1 ? 'Content & Context' : wizardStep === 2 ? 'Inbound Optimization' : 'Transmission Protocol'}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phased Deployment • Phase {wizardStep}</p>
                </div>
              </div>
              <button onClick={() => setShowWizard(false)} className="p-3 hover:bg-slate-200 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              {wizardStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Internal Campaign Name</label>
                      <input 
                        type="text" 
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold outline-none transition-all" 
                        placeholder="e.g. Q4 Growth Sequence" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Primary Subject Line</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={newCampaign.subject}
                          onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                          className="w-full pl-6 pr-12 py-4 bg-slate-900 text-white border-none rounded-2xl text-sm outline-none font-medium" 
                          placeholder="Your unique subject..." 
                        />
                        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border-2 border-dashed border-indigo-100 flex flex-col justify-center items-center text-center">
                    <Globe className="text-indigo-600 mb-6" size={48} />
                    <h4 className="text-lg font-black text-indigo-900 mb-3">Scheduling Logic</h4>
                    <div className="grid grid-cols-1 gap-4 w-full">
                       <div className="flex gap-4">
                         <div className="flex-1">
                            <label className="block text-[9px] font-black text-indigo-400 uppercase mb-1">Launch Date</label>
                            <input 
                              type="datetime-local" 
                              value={newCampaign.scheduledAt}
                              onChange={(e) => setNewCampaign({...newCampaign, scheduledAt: e.target.value})}
                              className="w-full px-4 py-3 bg-white border-none rounded-xl text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500" 
                            />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                           <h4 className="font-black text-slate-900 flex items-center gap-2"><Timer size={20}/> Velocity Control</h4>
                           <span className="text-xs font-black text-indigo-600">{newCampaign.sendingSpeed} / min</span>
                        </div>
                        <input 
                          type="range" min="1" max="500" 
                          value={newCampaign.sendingSpeed}
                          onChange={(e) => setNewCampaign({...newCampaign, sendingSpeed: parseInt(e.target.value)})}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-6" 
                        />
                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                           <ShieldCheck className="text-amber-600" size={24} />
                           <div>
                              <p className="text-xs font-bold text-amber-900">Anti-Spam Throttling</p>
                              <p className="text-[10px] text-amber-700">Speeds above 200/min require high IP reputation nodes.</p>
                           </div>
                        </div>
                     </div>
                     <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between items-center mb-4">
                             <p className="font-black text-lg">IP Warm-up Protocol</p>
                             <button 
                               onClick={() => setNewCampaign({...newCampaign, isWarmup: !newCampaign.isWarmup})}
                               className={`w-12 h-6 rounded-full transition-all relative ${newCampaign.isWarmup ? 'bg-emerald-500' : 'bg-white/20'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newCampaign.isWarmup ? 'left-7' : 'left-1'}`}></div>
                             </button>
                           </div>
                           <p className="text-xs text-slate-400 leading-relaxed">
                             Enabling Warm-up slowly increases sending volume over 14 days to build ISP trust. Highly recommended for new domains.
                           </p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase">
                           <RefreshCw size={14} className="animate-spin-slow" /> Rotation Active
                        </div>
                     </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <Server size={18} className="text-indigo-600" />
                        Transmitter Cluster Selection ({newCampaign.smtpPoolIds?.length || 0})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {availableSenders.map(sender => (
                          <button 
                            key={sender.id}
                            onClick={() => toggleSender(sender.id)}
                            className={`p-5 rounded-3xl border-2 transition-all text-left group ${
                              newCampaign.smtpPoolIds?.includes(sender.id) 
                                ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-100' 
                                : 'bg-white border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-3 rounded-2xl ${newCampaign.smtpPoolIds?.includes(sender.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                  <Server size={20} />
                               </div>
                               {newCampaign.smtpPoolIds?.includes(sender.id) && <CheckCircle2 size={16} className="text-indigo-600" />}
                            </div>
                            <p className="text-sm font-black text-slate-900 truncate">{sender.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{sender.host}</p>
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="flex flex-col items-center justify-center h-full space-y-10 py-20">
                   <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400/20 blur-[50px] animate-pulse rounded-full"></div>
                      <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[3rem] flex items-center justify-center relative">
                        <CheckCircle2 size={64} />
                      </div>
                   </div>
                   <div className="text-center space-y-4 max-w-md">
                     <h3 className="text-4xl font-black text-slate-900 tracking-tighter">System Ready</h3>
                     <p className="text-slate-500 font-medium">All parameters verified. Your campaign is queued for {new Date(newCampaign.scheduledAt || '').toLocaleString()}.</p>
                     
                     <div className="mt-10 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-left space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold">
                           <span className="text-slate-400">MISSION:</span>
                           <span className="text-slate-900">{newCampaign.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold">
                           <span className="text-slate-400">CLUSTER:</span>
                           <span className="text-indigo-600">{newCampaign.smtpPoolIds?.length} NODES</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold">
                           <span className="text-slate-400">PROTOCOL:</span>
                           <span className="text-slate-900 uppercase">{newCampaign.isWarmup ? 'WARM-UP' : 'INSTANT'}</span>
                        </div>
                     </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-100 border-t border-slate-200 flex justify-between items-center px-12">
              <button 
                onClick={() => setWizardStep(prev => prev - 1)}
                disabled={wizardStep === 1}
                className="px-10 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30"
              >
                PREVIOUS
              </button>
              {wizardStep < 3 ? (
                <button 
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
                >
                  NEXT PHASE
                </button>
              ) : (
                <button 
                  onClick={handleLaunch}
                  disabled={loading}
                  className="px-16 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center gap-3 active:scale-95"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <Play size={24} />}
                  INITIATE MISSION
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sequence Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nodes</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.length > 0 ? campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{camp.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 mt-1">
                       <Calendar size={12} /> {new Date(camp.scheduledAt || '').toLocaleDateString()}
                       <span className="opacity-30">|</span>
                       <Clock size={12} /> {new Date(camp.scheduledAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                       <Server size={12} className="text-indigo-500" />
                       <span className="text-xs font-black text-slate-700">{camp.smtpPoolIds?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      camp.status === 'sending' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col items-center">
                       <div className="text-[10px] font-black text-slate-900 mb-2">{camp.stats?.sent || 0} / {camp.stats?.total || 1000}</div>
                       <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                         <div 
                           className="h-full bg-indigo-500 transition-all duration-1000" 
                           style={{ width: `${Math.min(100, (camp.stats?.sent / (camp.stats?.total || 1000)) * 100)}%` }}
                         ></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3">
                       <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Edit size={18}/></button>
                       <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-slate-200">
                    <Zap size={80} className="opacity-10" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Zero Active Campaigns</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`.animate-spin-slow { animation: spin 4s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CampaignManager;
