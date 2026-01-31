
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Send, CheckCircle, AlertCircle, Eye, TrendingUp, Database, CloudLightning, RefreshCw, Zap, Clock
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { storage } from '../services/storageService.ts';
import { Campaign } from '../types';

const Dashboard: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<{online: boolean, writable: boolean} | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [health, campaigns] = await Promise.all([
          storage.get('check_status'),
          storage.get('get_campaigns')
        ]);
        setServerStatus({ online: true, writable: health.storage_writable || true });
        setActiveCampaigns(campaigns.filter((c: any) => c.status === 'sending'));
      } catch (e) {
        setServerStatus({ online: false, writable: false });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = [
    { name: '08:00', sent: 1200 }, { name: '10:00', sent: 2100 }, { name: '12:00', sent: 4500 },
    { name: '14:00', sent: 3800 }, { name: '16:00', sent: 5100 }, { name: '18:00', sent: 2900 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Console</h1>
          <p className="text-slate-500">Global traffic overview and sending health.</p>
        </div>
        <div className="flex gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
            serverStatus?.online ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            <CloudLightning size={14}/>
            {serverStatus?.online ? 'Live Nodes Active' : 'Offline Mode'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Sent" value="1.2M" icon={<Send size={24}/>} color="bg-indigo-600" trend="+8.4%"/>
        <StatsCard label="Inbox Success" value="99.4%" icon={<CheckCircle size={24}/>} color="bg-emerald-500" trend="+0.1%"/>
        <StatsCard label="Open Velocity" value="342/min" icon={<Eye size={24}/>} color="bg-amber-500" trend="+22%"/>
        <StatsCard label="Bounce Rate" value="0.04%" icon={<AlertCircle size={24}/>} color="bg-rose-500" trend="-0.1%"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-indigo-600" />
                Inbound Engagement Flow
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="sent" stroke="#6366f1" fillOpacity={1} fill="url(#colorSent)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Campaigns List */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="text-amber-500" /> Active Transmissions
            </h2>
            <div className="space-y-4">
              {activeCampaigns.length > 0 ? activeCampaigns.map((camp) => {
                const progress = Math.min(100, (camp.stats?.sent / (camp.stats?.total || 100)) * 100);
                return (
                  <div key={camp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-900">{camp.name}</span>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-12 text-center text-slate-300 font-black uppercase text-xs tracking-widest border-2 border-dashed border-slate-100 rounded-3xl">
                  No Active Missions
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                  <Clock className="text-indigo-400" /> Queue Integrity
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                      <span>Worker Load</span>
                      <span className="text-emerald-400">Normal</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full">
                      <div className="h-full bg-emerald-500" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                      <span>SMTP Pool health</span>
                      <span className="text-indigo-400">98.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full">
                      <div className="h-full bg-indigo-500" style={{ width: '98.2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Recent Activity</h3>
             <div className="space-y-6">
                {[
                  { user: 'S. Jenkins', action: 'Delivered', time: '1m ago', color: 'bg-emerald-100 text-emerald-600' },
                  { user: 'M. Ross', action: 'Clicked Link', time: '3m ago', color: 'bg-indigo-100 text-indigo-600' },
                  { user: 'A. Cooper', action: 'Bounced', time: '8m ago', color: 'bg-rose-100 text-rose-600' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${act.color}`}>
                      {act.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{act.user}</p>
                      <p className="text-[10px] text-slate-400">{act.action}</p>
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold">{act.time}</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
