
import React, { useState } from 'react';
import { Sparkles, Wand2, ShieldCheck, Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { getSubjectSuggestions, checkSpamScore } from '../services/geminiService';

const AIOptimizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [spamAnalysis, setSpamAnalysis] = useState<{score: number, reasons: string[]} | null>(null);

  const handleSuggest = async () => {
    if (!content) return;
    setLoading(true);
    const results = await getSubjectSuggestions(content);
    setSuggestions(results);
    setLoading(false);
  };

  const handleSpamCheck = async () => {
    if (!subject || !content) return;
    setLoading(true);
    const result = await checkSpamScore(subject, content);
    setSpamAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">AI Campaign Optimizer</h1>
        <p className="text-slate-500">Use generative AI to boost your delivery rates and engagement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Subject</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your initial subject line..."
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Content</label>
            <textarea 
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your email draft here to get AI recommendations..."
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSuggest}
              disabled={loading || !content}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Suggest Subjects
            </button>
            <button 
              onClick={handleSpamCheck}
              disabled={loading || !subject || !content}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              Spam Check
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Suggestions Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Wand2 size={24} />
              </div>
              <h2 className="text-lg font-bold">AI Suggestions</h2>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group hover:bg-indigo-50 transition-colors">
                    <span className="text-sm font-medium text-slate-700">{s}</span>
                    <button 
                      onClick={() => { setSubject(s); }}
                      className="p-2 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p>Click "Suggest Subjects" to see AI-powered alternatives.</p>
              </div>
            )}
          </div>

          {/* Spam Analysis Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-lg font-bold">Spam Risk Analysis</h2>
            </div>

            {spamAnalysis ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">Risk Score</span>
                    <span className={`text-xl font-black ${spamAnalysis.score > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {spamAnalysis.score}/100
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${spamAnalysis.score > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${spamAnalysis.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Observations</h3>
                  {spamAnalysis.reasons.map((reason, idx) => (
                    <div key={idx} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p>Click "Spam Check" to verify your content deliverability.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptimizer;
