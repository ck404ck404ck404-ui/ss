
import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Shield, Zap, Save, Bell, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [appConfig, setAppConfig] = useState({
    trackingDomain: 'click.omnisend.pro',
    defaultDelay: 10,
    enableRetry: true,
    maxRetries: 3,
    debugMode: false
  });

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500">Manage global transmission protocols and security layers.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Globe size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900">Infrastructure</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Tracking Subdomain</label>
                 <input 
                    type="text" 
                    value={appConfig.trackingDomain}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    onChange={e => setAppConfig({...appConfig, trackingDomain: e.target.value})}
                 />
                 <p className="mt-2 text-[10px] text-slate-400 font-medium">Used for CNAME link tracking and open-tracking pixels.</p>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Default Interval (Seconds)</label>
                 <input 
                    type="number" 
                    value={appConfig.defaultDelay}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm"
                    onChange={e => setAppConfig({...appConfig, defaultDelay: parseInt(e.target.value)})}
                 />
              </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                 <Shield size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900">Security & Failover</h2>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem]">
                 <div>
                    <p className="text-sm font-black text-slate-900">Automatic Retry Logic</p>
                    <p className="text-xs text-slate-500">Retry sending if SMTP server temporarily times out.</p>
                 </div>
                 <button 
                   onClick={() => setAppConfig({...appConfig, enableRetry: !appConfig.enableRetry})}
                   className={`w-14 h-7 rounded-full transition-all relative ${appConfig.enableRetry ? 'bg-indigo-600' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${appConfig.enableRetry ? 'left-8' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem]">
                 <div>
                    <p className="text-sm font-black text-slate-900">Deep Debug Logs</p>
                    <p className="text-xs text-slate-500">Log detailed SMTP handshake data for troubleshooting.</p>
                 </div>
                 <button 
                   onClick={() => setAppConfig({...appConfig, debugMode: !appConfig.debugMode})}
                   className={`w-14 h-7 rounded-full transition-all relative ${appConfig.debugMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${appConfig.debugMode ? 'left-8' : 'left-1'}`}></div>
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
         <button className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-black transition-all shadow-2xl active:scale-95">
            <Save size={20} />
            COMMIT CHANGES
         </button>
      </div>
    </div>
  );
};

export default Settings;
