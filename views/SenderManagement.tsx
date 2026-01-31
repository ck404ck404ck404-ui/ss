import React, { useState, useEffect } from 'react';
import { 
  Plus, Server, Power, RefreshCw, X, CheckCircle2
} from 'lucide-react';
import { storage } from '../services/storageService.ts';

const SenderManagement: React.FC = () => {
  const [senders, setSenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSender, setNewSender] = useState({ name: '', host: '', port: 587, user: '', pass: '' });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await storage.get('get_senders');
    setSenders(data);
    setLoading(false);
  };

  const handleAddSender = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await storage.save('save_sender', newSender);
    if (success) {
      setShowAddModal(false);
      load();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SMTP Senders</h1>
          <p className="text-slate-500">Active SMTP pool: {senders.length}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg">
          <Plus size={20} />
          <span>Add Server</span>
        </button>
      </header>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">SMTP Setup</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
             </div>
             <form onSubmit={handleAddSender} className="space-y-4">
                <input required placeholder="Server Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm" onChange={e => setNewSender({...newSender, name: e.target.value})} />
                <input required placeholder="Host (e.g. smtp.gmail.com)" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm" onChange={e => setNewSender({...newSender, host: e.target.value})} />
                <input required placeholder="Email/User" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm" onChange={e => setNewSender({...newSender, user: e.target.value})} />
                <input required type="password" placeholder="Pass/Key" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm" onChange={e => setNewSender({...newSender, pass: e.target.value})} />
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl">Connect & Save</button>
             </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {senders.map((s, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4 hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Server size={24}/></div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-400">{s.user}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase"><CheckCircle2 size={12}/> Ready</div>
          </div>
        ))}
        {senders.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active senders</div>
        )}
      </div>
    </div>
  );
};

export default SenderManagement;
