
import React, { useState } from 'react';
import { 
  CreditCard, 
  Key, 
  History, 
  Plus, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  Crown,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';

const BusinessCenter: React.FC = () => {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SaaS Business Center</h1>
          <p className="text-slate-500">Manage your subscription, credits, and developer API access.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 font-bold text-xs uppercase">
          <Crown size={14} />
          Pro Enterprise Plan
        </div>
      </header>

      {/* Credit & Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-48 h-48 relative flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
              <circle 
                cx="96" cy="96" r="88" stroke="#6366f1" strokeWidth="16" fill="transparent" 
                strokeDasharray="552.92" strokeDashoffset="304.1" strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-black text-slate-900">45%</p>
              <p className="text-[10px] font-black text-slate-400 uppercase">Used</p>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Email Credit Balance</h2>
              <p className="text-sm text-slate-500">Your monthly quota resets in 12 days.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current Usage</p>
                <p className="text-xl font-black text-slate-900">45,000</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Limit</p>
                <p className="text-xl font-black text-indigo-600">100,000</p>
              </div>
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              <Plus size={20} />
              Purchase Extra Credits
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl">
           <div>
             <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
               <Zap className="text-amber-400" />
               Auto-Refill
             </h3>
             <p className="text-xs text-slate-400 leading-relaxed">
               Automatically purchase 50,000 credits when balance falls below 5,000.
             </p>
           </div>
           <div className="mt-8">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CreditCard size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Visa •••• 4242</p>
                    <p className="text-[10px] text-slate-500">Primary Payment Method</p>
                  </div>
                </div>
                <button className="text-[10px] font-black text-indigo-400 uppercase hover:underline">Change</button>
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-all">
                MANAGE BILLING PORTAL
              </button>
           </div>
        </div>
      </div>

      {/* API Key Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Key className="text-indigo-600" />
              Developer API Keys
            </h2>
            <button className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
              + Generate New Key
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Live Production Key</span>
                 <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded">Active</span>
               </div>
               <div className="flex gap-2">
                 <div className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl font-mono text-xs overflow-hidden truncate">
                   {apiKeyVisible ? 'os_live_9482_x84j_v827_z401_k923' : '••••••••••••••••••••••••••••••••'}
                 </div>
                 <button 
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm"
                 >
                   <Lock size={16} />
                 </button>
                 <button 
                  onClick={handleCopy}
                  className={`p-3 border rounded-xl shadow-sm transition-all ${copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'}`}
                 >
                   {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                 </button>
               </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl flex gap-4 items-start border border-indigo-100">
              <Info className="text-indigo-600 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-900">Full API Documentation</p>
                <p className="text-[10px] text-indigo-700">Integrate OmniSend Pro directly into your apps using our REST API or Node/Python SDKs.</p>
                <button className="text-[10px] font-black text-indigo-600 flex items-center gap-1 mt-2">
                  VIEW DOCS <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Billing History */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <History className="text-indigo-600" />
            Billing History
          </h2>
          <div className="space-y-4">
            {[
              { id: 'INV-4920', date: 'Oct 12, 2024', amount: '$49.00', status: 'Paid', items: 'Pro Monthly + 10k Credits' },
              { id: 'INV-4815', date: 'Sep 12, 2024', amount: '$29.00', status: 'Paid', items: 'Pro Monthly Subscription' },
              { id: 'INV-4701', date: 'Aug 12, 2024', amount: '$29.00', status: 'Paid', items: 'Pro Monthly Subscription' },
            ].map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <History size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{inv.id}</p>
                    <p className="text-[10px] text-slate-500">{inv.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{inv.amount}</p>
                  <p className="text-[10px] text-slate-400">{inv.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-xs font-black text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-50 rounded-xl transition-all">
            VIEW ALL INVOICES <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Upgrade Your Capabilities</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Scale your outreach with more credits, advanced SMTP rotation, and white-label branding.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Starter', price: '$0', emails: '1k', color: 'bg-slate-50', text: 'text-slate-900', current: false },
            { name: 'Pro', price: '$29', emails: '100k', color: 'bg-indigo-600', text: 'text-white', current: true },
            { name: 'Enterprise', price: '$199', emails: '1M+', color: 'bg-slate-900', text: 'text-white', current: false },
          ].map((plan) => (
            <div key={plan.name} className={`${plan.color} ${plan.text} p-8 rounded-[2rem] shadow-xl relative overflow-hidden transition-all hover:scale-105`}>
              {plan.current && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Current Plan
                </div>
              )}
              <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-xs font-bold opacity-60">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm font-bold opacity-90">
                  <CheckCircle2 size={18} className="shrink-0" /> {plan.emails} Emails/Mo
                </li>
                <li className="flex items-center gap-3 text-sm font-bold opacity-90">
                  <CheckCircle2 size={18} className="shrink-0" /> SMTP Auto-Rotation
                </li>
                <li className="flex items-center gap-3 text-sm font-bold opacity-90">
                  <CheckCircle2 size={18} className="shrink-0" /> AI Content Engine
                </li>
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                plan.current ? 'bg-white/20 border border-white/20 cursor-default' : 'bg-white text-slate-900 hover:shadow-2xl'
              }`}>
                {plan.current ? 'ACTIVE' : 'UPGRADE NOW'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCenter;
