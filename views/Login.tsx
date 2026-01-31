
import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Default password check
    // In a real app, this would be an API call to api.php
    setTimeout(() => {
      const savedPass = localStorage.getItem('omnisend_admin_pass') || 'admin123';
      
      if (password === savedPass) {
        sessionStorage.setItem('omnisend_is_authenticated', 'true');
        onLogin();
      } else {
        setError('Invalid administrator password. Access denied.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 mb-6">
            <Mail className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">OmniSend <span className="text-indigo-600">Pro</span></h1>
          <p className="text-slate-500 mt-2 font-medium uppercase text-[10px] tracking-widest">Enterprise Email Marketing Suite</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">Administrator Login</h2>
            <p className="text-sm text-slate-500 mt-1">Please enter your secure access key.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-shake">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Access Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <RefreshCw size={24} className="animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Secure 256-bit Encrypted Session</span>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          Default Key: <code className="bg-slate-200 px-2 py-0.5 rounded text-slate-600">admin123</code>
        </p>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Login;
