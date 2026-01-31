
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MousePointer2, 
  Eye, 
  TrendingUp,
  Database,
  CloudLightning,
  RefreshCw
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

const data = [
  { name: 'Mon', sent: 4000, opens: 2400, clicks: 1200 },
  { name: 'Tue', sent: 3000, opens: 1398, clicks: 800 },
  { name: 'Wed', sent: 2000, opens: 9800, clicks: 3400 },
  { name: 'Thu', sent: 2780, opens: 3908, clicks: 1200 },
  { name: 'Fri', sent: 1890, opens: 4800, clicks: 2100 },
  { name: 'Sat', sent: 2390, opens: 3800, clicks: 900 },
  { name: 'Sun', sent: 3490, opens: 4300, clicks: 1400 },
];

const Dashboard: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<{online: boolean, writable: boolean} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const API_URL = (window as any).API_ENDPOINT || 'api.php';
        const res = await fetch(`${API_URL}?action=check_status`);
        const json = await res.json();
        setServerStatus({ online: true, writable: json.storage_writable });
      } catch (e) {
        setServerStatus({ online: false, writable: false });
      } finally {
        setLoading(false);
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase border transition-all ${
            loading ? 'bg-slate-50 border-slate-100 text-slate-400' :
            serverStatus?.online ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            {loading ? <RefreshCw size={14} className="animate-spin"/> : <CloudLightning size={14}/>}
            {loading ? 'Checking Server...' : serverStatus?.online ? 'Backend Online' : 'Backend Offline'}
          </div>
          {serverStatus?.online && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase border ${
              serverStatus.writable ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'
            }`}>
              <Database size={14}/>
              {serverStatus.writable ? 'Storage Ready' : 'Permissions Error'}
            </div>
          )}
        </div>
      </header>

      {!loading && serverStatus?.online === false && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center gap-4 text-rose-900 animate-bounce">
          <AlertCircle className="shrink-0" size={32} />
          <div>
            <p className="font-bold">Critical: Backend connection failed</p>
            <p className="text-sm opacity-80 text-rose-700">Ensure api.php is uploaded and PHP is enabled on your CyberPanel domain.</p>
          </div>
        </div>
      )}

      {serverStatus?.writable === false && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4 text-amber-900">
          <Database className="shrink-0" size={32} />
          <div>
            <p className="font-bold">Write Permissions Required</p>
            <p className="text-sm opacity-80 text-amber-700">CyberPanel needs to grant write access to the 'data' folder. Run 'Fix Permissions' in CyberPanel.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Sent" value="128,432" icon={<Send size={24}/>} color="bg-indigo-500" trend="+12.5%"/>
        <StatsCard label="Delivered" value="98.2%" icon={<CheckCircle size={24}/>} color="bg-emerald-500" trend="+0.3%"/>
        <StatsCard label="Open Rate" value="24.8%" icon={<Eye size={24}/>} color="bg-amber-500" trend="-2.1%"/>
        <StatsCard label="Bounce Rate" value="0.4%" icon={<AlertCircle size={24}/>} color="bg-rose-500" trend="-0.1%"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" />
              Performance Analytics
            </h2>
            <select className="bg-slate-50 border-none text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500 py-1.5 px-3">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sent" stroke="#6366f1" fillOpacity={1} fill="url(#colorSent)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Real-time Activity</h2>
          <div className="space-y-6">
            {[
              { user: 'Sarah Jenkins', action: 'opened "Summer Sale"', time: '2m ago', color: 'bg-emerald-100 text-emerald-600' },
              { user: 'Mike Ross', action: 'clicked a link in "Update"', time: '5m ago', color: 'bg-indigo-100 text-indigo-600' },
              { user: 'Alice Cooper', action: 'unsubscribed', time: '12m ago', color: 'bg-slate-100 text-slate-600' },
              { user: 'Tom Hardy', action: 'bounced', time: '20m ago', color: 'bg-rose-100 text-rose-600' },
              { user: 'John Wick', action: 'opened "Welcome"', time: '45m ago', color: 'bg-emerald-100 text-emerald-600' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activity.color}`}>
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{activity.user}</p>
                  <p className="text-xs text-slate-500">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
