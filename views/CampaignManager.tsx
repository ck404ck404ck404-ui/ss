
import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Pause, Trash2, Edit, Search, Filter, Calendar, Clock, Zap, Globe,
  Settings, ChevronRight, Send, Split, Layers, Repeat, ShieldCheck, MousePointer2,
  Copy, Info, X, PlusCircle, Timer, Hash, Sparkles, RefreshCw, CheckCircle2, Server
} from 'lucide-react';
import { Campaign, FollowUp, SMTPServer } from '../types';
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
    altSubjects: [],
    useRandomDelay: true,
    smtpPoolIds: [],
    followUps: [],
    sendingSpeed: 50,
    stats: { sent: 0, failed: 0, opened: 0, clicked: 0 }
  });

  useEffect(() => {
    load();
    loadSenders();
  }, []);

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
    if (!newCampaign.name || !newCampaign.subject) {
      alert("Please provide a campaign name and subject.");
      return;
    }

    if (!newCampaign.smtpPoolIds || newCampaign.smtpPoolIds.length === 0) {
      alert("Please select at least one SMTP server for rotation.");
      setWizardStep(2);
      return;
    }

    setLoading(true);
    const campaignToSave = {
      ...newCampaign,
      status: 'sending' as const,
    };
    const success = await storage.save('save_campaign', campaignToSave);
    if (success) {
      setShowWizard(false);
      load();
      // Reset form
      setNewCampaign({
        name: '',
        subject: '',
        altSubjects: [],
        useRandomDelay: true,
        smtpPoolIds: [],
        followUps: [],
        sendingSpeed: 50,
        stats: { sent: 0, failed: 0, opened: 0, clicked: 0 }
      });
    }
    setLoading(false);
  };

  const toggleSender = (id: string) => {
    const currentPool = [...(newCampaign.smtpPoolIds || [])];
    if (currentPool.includes(id)) {
      setNewCampaign({ ...newCampaign, smtpPoolIds: currentPool.filter(sid => sid !== id) });
    } else {
      setNewCampaign({ ...newCampaign, smtpPoolIds: [...currentPool, id] });
    }
  };

  const injectUniqueTag = (target: 'primary' | number) => {
    const tag = ' {{UNIQUE_NUM}}';
    if (target === 'primary') {
      setNewCampaign({ ...newCampaign, subject: (newCampaign.subject || '') + tag });
    } else {
      const updatedAlts = [...(newCampaign.altSubjects || [])];
      updatedAlts[target] = (updatedAlts[target] || '') + tag;
      setNewCampaign({ ...newCampaign, altSubjects: updatedAlts });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Manager</h1>
          <p className="text-slate-500">Create smart, multi-stage sequences with SMTP rotation.</p>
        </div>
        <button 
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>New Smart Campaign</span>
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase opacity-60 mb-1">Active Now</p>
            <p className="text-3xl font-black">{campaigns.filter(c => c.status === 'sending').length}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Zap size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase mb-1">Total Leads</p>
            <p className="text-3xl font-black text-emerald-500">98% Success</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase mb-1">Sequences</p>
            <p className="text-3xl font-black text-slate-900">{campaigns.length}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Repeat size={24} />
          </div>
        </div>
      </div>

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">
                  {wizardStep}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {wizardStep === 1 ? 'Campaign Content' : wizardStep === 2 ? 'Advanced Delivery' : 'Automation & Launch'}
                  </h2>
                  <p className="text-sm text-slate-500">Step {wizardStep} of 3</p>
                </div>
              </div>
              <button onClick={() => setShowWizard(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {wizardStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2">Campaign Name</label>
                      <input 
                        type="text" 
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500" 
                        placeholder="My Awesome Campaign" 
                      />
                    </div>
                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Subject Line</label>
                        <button onClick={() => injectUniqueTag('primary')} className="text-[9px] font-black bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-all">INJECT ID</button>
                      </div>
                      <input 
                        type="text" 
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
                        placeholder="Enter subject..." 
                      />
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col justify-center items-center text-center">
                    <Sparkles className="text-indigo-600 mb-4" size={32} />
                    <h4 className="font-bold text-indigo-900 mb-2">AI Ready</h4>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      Your subject lines will be automatically optimized to bypass common spam triggers found in modern ISP filters.
                    </p>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                        <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2"><Timer size={20}/> Delivery Speed</h4>
                        <input 
                          type="range" 
                          min="1" 
                          max="100" 
                          value={newCampaign.sendingSpeed}
                          onChange={(e) => setNewCampaign({...newCampaign, sendingSpeed: parseInt(e.target.value)})}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-4" 
                        />
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>Slow (1/min)</span>
                          <span className="text-indigo-600 font-bold">{newCampaign.sendingSpeed}/min</span>
                          <span>Fast (100/min)</span>
                        </div>
                     </div>
                     <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex flex-col justify-center items-center text-center">
                        <Layers size={32} className="text-indigo-400 mb-4" />
                        <p className="font-bold mb-1">Rotation Intelligence</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">The system will automatically cycle through your selected SMTP pool to avoid blacklisting and IP fatigue.</p>
                     </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                          <Server size={16} className="text-indigo-600" />
                          SMTP Selection Pool ({newCampaign.smtpPoolIds?.length || 0})
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400">SELECT AT LEAST ONE</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableSenders.length > 0 ? availableSenders.map(sender => {
                          const isSelected = newCampaign.smtpPoolIds?.includes(sender.id);
                          return (
                            <button 
                              key={sender.id}
                              onClick={() => toggleSender(sender.id)}
                              className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group ${
                                isSelected 
                                  ? 'bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-100' 
                                  : 'bg-white border-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Server size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{sender.name}</p>
                                <p className="text-[10px] text-slate-400 truncate">{sender.user}</p>
                              </div>
                              {isSelected && <CheckCircle2 size={16} className="text-indigo-600" />}
                            </button>
                          );
                        }) : (
                          <div className="col-span-full py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                            <p className="text-sm font-bold text-slate-400">No SMTP servers found.</p>
                            <p className="text-[10px] text-slate-400 mt-1">Please add servers in the SMTP Senders menu first.</p>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center">
                      <CheckCircle2 size={48} />
                   </div>
                   <div className="text-center space-y-2">
                     <h3 className="text-2xl font-black text-slate-900">Ready to Blast?</h3>
                     <p className="text-sm text-slate-500">Your campaign is configured with {newCampaign.smtpPoolIds?.length} rotation nodes.</p>
                     
                     <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-3 max-w-md mx-auto">
                        <div className="flex justify-between text-xs font-bold">
                           <span className="text-slate-400">Campaign:</span>
                           <span className="text-slate-900">{newCampaign.name}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                           <span className="text-slate-400">Subject:</span>
                           <span className="text-slate-900 truncate max-w-[200px]">{newCampaign.subject}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                           <span className="text-slate-400">Server Nodes:</span>
                           <span className="text-indigo-600 font-black">{newCampaign.smtpPoolIds?.length} active</span>
                        </div>
                     </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between">
              <button 
                onClick={() => setWizardStep(prev => prev - 1)}
                disabled={wizardStep === 1}
                className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30"
              >
                Back
              </button>
              {wizardStep < 3 ? (
                <button 
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  onClick={handleLaunch}
                  disabled={loading}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <Play size={20} />}
                  Launch Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Pool Size</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Performance</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.length > 0 ? campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900">{camp.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{camp.subject}</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                       <Server size={14} className="text-indigo-400" />
                       <span className="text-xs font-black text-slate-700">{camp.smtpPoolIds?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      camp.status === 'sending' ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                       <div className="text-[10px] font-black text-slate-900 mb-1">{camp.stats?.sent || 0} Sent</div>
                       <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500" style={{ width: '10%' }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">No Campaigns Created</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;
