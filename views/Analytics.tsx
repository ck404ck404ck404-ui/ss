
import React from 'react';
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
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Mail, 
  Zap, 
  Target, 
  ShieldAlert, 
  MousePointer2,
  Server,
  Smartphone,
  Monitor
} from 'lucide-react';

const deliveryData = [
  { name: 'Mon', gmail: 4000, outlook: 2400, yahoo: 1200 },
  { name: 'Tue', gmail: 3000, outlook: 1398, yahoo: 2210 },
  { name: 'Wed', gmail: 2000, outlook: 9800, yahoo: 2290 },
  { name: 'Thu', gmail: 2780, outlook: 3908, yahoo: 2000 },
  { name: 'Fri', gmail: 1890, outlook: 4800, yahoo: 2181 },
  { name: 'Sat', gmail: 2390, outlook: 3800, yahoo: 2500 },
  { name: 'Sun', gmail: 3490, outlook: 4300, yahoo: 2100 },
];

const smtpPerformance = [
  { name: 'Gmail Pro', success: 98, bounce: 1, spam: 1 },
  { name: 'SendGrid VIP', success: 92, bounce: 5, spam: 3 },
  { name: 'AWS SES', success: 99.5, bounce: 0.2, spam: 0.3 },
  { name: 'Private Relay', success: 85, bounce: 10, spam: 5 },
];

const deviceData = [
  { name: 'Mobile', value: 65, color: '#6366f1' },
  { name: 'Desktop', value: 30, color: '#10b981' },
  { name: 'Others', value: 5, color: '#f59e0b' },
];

const ispBreakdown = [
  { name: 'Gmail', value: 45, color: '#ef4444' },
  { name: 'Outlook', value: 25, color: '#3b82f6' },
  { name: 'Yahoo', value: 15, color: '#a855f7' },
  { name: 'Custom Domains', value: 15, color: '#64748b' },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Analytics</h1>
          <p className="text-slate-500">Deep dive into your campaign deliverability and engagement metrics.</p>
        </div>
        <div className="flex gap-3">
           <select className="bg-white border border-slate-200 text-sm font-bold rounded-xl px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500">
             <option>All Campaigns</option>
             <option>Summer Launch 2024</option>
             <option>Black Friday Prep</option>
           </select>
        </div>
      </header>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Open Rate', value: '24.8%', icon: <Target />, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+2.4%' },
          { label: 'Avg. Click Rate', value: '8.2%', icon: <MousePointer2 />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+1.1%' },
          { label: 'Spam Complaint', value: '0.02%', icon: <ShieldAlert />, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-0.01%' },
          { label: 'Global Reputation', value: 'High', icon: <Zap />, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Stable' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Delivery Area Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" />
              Volume by Provider (ISP)
            </h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400">GMAIL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400">OUTLOOK</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deliveryData}>
                <defs>
                  <linearGradient id="colorGmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutlook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                />
                <Area type="monotone" dataKey="gmail" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorGmail)" />
                <Area type="monotone" dataKey="outlook" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorOutlook)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ISP Distribution Pie */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <Globe className="text-indigo-600" />
            Audience Domain Share
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ispBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ispBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {ispBreakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-slate-500">{item.name}</span>
                </div>
                <span className="text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SMTP Performance Table/Chart */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Server className="text-indigo-400" />
                SMTP Deliverability Comparison
              </h2>
           </div>
           <div className="space-y-6">
             {smtpPerformance.map((smtp) => (
               <div key={smtp.name} className="space-y-2">
                 <div className="flex justify-between items-end">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{smtp.name}</span>
                   <span className="text-xs font-black text-emerald-400">{smtp.success}% SUCCESS</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: `${smtp.success}%` }}></div>
                    <div className="h-full bg-rose-500" style={{ width: `${smtp.bounce}%` }}></div>
                    <div className="h-full bg-amber-500" style={{ width: `${smtp.spam}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-8 pt-6 border-t border-white/10 flex justify-between gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Delivered
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
               <div className="w-2 h-2 bg-rose-500 rounded-full"></div> Bounce
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
               <div className="w-2 h-2 bg-amber-500 rounded-full"></div> Spam
             </div>
           </div>
        </div>

        {/* Device Engagement */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
             <Smartphone className="text-indigo-600" />
             Engagement by Device
           </h2>
           <div className="grid grid-cols-2 gap-8 h-full items-center">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-4">
                  <Smartphone className="text-indigo-600" />
                  <div>
                    <p className="text-2xl font-black text-indigo-900">65%</p>
                    <p className="text-[10px] font-black text-indigo-400 uppercase">Mobile Users</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
                  <Monitor className="text-emerald-600" />
                  <div>
                    <p className="text-2xl font-black text-emerald-900">30%</p>
                    <p className="text-[10px] font-black text-emerald-400 uppercase">Desktop Users</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
