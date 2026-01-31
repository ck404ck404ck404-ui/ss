
import React, { useState } from 'react';
import { ShieldCheck, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('omnisend_admin_pass');
    
    if (currentPass !== stored) {
      setMessage({ type: 'error', text: 'The current password you entered is incorrect.' });
      return;
    }
    if (newPass !== confirmPass) {
      setMessage({ type: 'error', text: 'The new passwords do not match.' });
      return;
    }
    if (newPass.length < 6) {
      setMessage({ type: 'error', text: 'The password must be at least 6 characters long.' });
      return;
    }

    localStorage.setItem('omnisend_admin_pass', newPass);
    setMessage({ type: 'success', text: 'Password successfully updated!' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-indigo-600" />
          Account & Security
        </h1>
        <p className="text-slate-500">Manage your admin password and security preferences from here.</p>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">New Password</label>
              <input 
                type="password" 
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="Type password again"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Update Password
          </button>
        </form>
      </div>

      <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white">
        <h3 className="font-bold flex items-center gap-2 mb-2">
          <AlertCircle className="text-amber-400" size={18} />
          Security Warning
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Never share your administrator credentials with anyone. If you clear your browser cache or local storage while using XAMPP, you may need to re-setup your initial password.
        </p>
      </div>
    </div>
  );
};

export default AccountSettings;
