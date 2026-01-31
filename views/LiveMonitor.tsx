
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Server, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Mail, 
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Clock
} from 'lucide-react';
import { SMTPServer } from '../types';
import { storage } from '../services/storageService.ts';

interface LiveLogEntry {
  id: string;
  senderName: string;
  recipient: string;
  subject: string;
  status: 'sending' | 'success' | 'failed';
  timestamp: string;
  smtpId: string;
}

const LiveMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LiveLogEntry[]>([]);
  const [servers, setServers] = useState<SMTPServer[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    const sData = await storage.get('get_senders');
    setServers(sData || []);
    const lData = await storage.get('get_logs');
    setLogs(lData || []);
  };

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      // Trigger background sending simulation
      await storage.heartbeat();
      
      // Pull latest logs
      const lData = await storage.get('get_logs');
      if (Array.isArray(lData)) {
        setLogs(lData);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="text-indigo-600 animate-pulse" />
            Global Sending Stream
          </h1>
          <p className="text-slate-500">Real-time visualization of all outbound traffic and SMTP load from the backend.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
            {isLive ? 'Live Connection Active' : 'Monitoring Paused'}
          </span>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
              isLive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-indigo-600 text-white'
            }`}
          >
            {isLive ? 'PAUSE FEED' : 'RESUME FEED'}
          </button>
        </div>
      </header>

      {/* Server Load Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servers.length > 0 ? servers.slice(0, 3).map(server => (
          <div key={server.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Server size={20} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                <p className="text-lg font-black text-emerald-500">ONLINE</p>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{server.name}</h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mb-6">
              <ShieldCheck size={12} className="text-emerald-500" />
              SMTP NODE
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">IP Health</span>
                  <span className="text-xs font-black text-slate-900">Excellent</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-emerald-500" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )) : (
            <div className="col-span-full py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
              <p className="text-xs font-black text-slate-400 uppercase">No active SMTP nodes found</p>
            </div>
        )}
      </div>

      {/* Main Stream Log */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <RefreshCw className="text-indigo-400 animate-spin-slow" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Live Outbound Activity</h2>
              <p className="text-xs text-slate-400">Showing last {logs.length} transactions</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
          {logs.length > 0 ? logs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors animate-in slide-in-from-right-2 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                log.status === 'failed' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                <Mail size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white truncate">{log.recipient}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-slate-400 font-bold uppercase shrink-0">
                    {log.senderName}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate opacity-80">{log.subject}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1.5 mb-1 justify-end">
                  {log.status === 'success' && <CheckCircle2 size={12} className="text-emerald-400" />}
                  {log.status === 'failed' && <XCircle size={12} className="text-rose-400" />}
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    log.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-bold">{log.timestamp}</span>
              </div>
            </div>
          )) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-600">
              <Zap size={48} className="mb-4 opacity-10" />
              <p className="font-bold uppercase tracking-widest text-xs opacity-30">Awaiting sending tasks...</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-slate-400">DNS Verified</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-bold text-slate-400">Backend Rotation Active</span>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LiveMonitor;
