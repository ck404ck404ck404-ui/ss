
import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, ShieldCheck, Copy, CheckCircle2, RefreshCw, AlertTriangle, Inbox } from 'lucide-react';
import { getSubjectSuggestions, checkSpamScore } from '../services/geminiService';

const SPAM_TRIGGER_WORDS = ['FREE', 'CASH', 'URGENT', 'WINNER', 'GUARANTEED', 'EARN', '$$$', 'INCOME'];

const AIOptimizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [spamAnalysis, setSpamAnalysis] = useState<{score: number, reasons: string[]} | null>(null);
  const [detectedSpamWords, setDetectedSpamWords] = useState<string[]>([]);

  useEffect(() => {
    const found = SPAM_TRIGGER_WORDS.filter(word => 
      content.toUpperCase().includes(word) || subject.toUpperCase().includes(word)
    );
    setDetectedSpamWords(found);
  }, [content, subject]);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Delivery Intel</h1>
        <p className="text-slate-500">Predict inbox placement and optimize content with Gemini Pro.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Email Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Initial hook..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Core Body Content</label>
              <textarea 
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="The meat of your message..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-medium outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {detectedSpamWords.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-start">
               <AlertTriangle className="text-amber-600 shrink-0" size={20} />
               <div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-tighter">Trigger Words Detected</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                     {detectedSpamWords.map(word => (
                       <span key={word} className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-black rounded uppercase">{word}</span>
                     ))}
                  </div>
               </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleSuggest}
              disabled={loading || !content}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              SUGGEST
            </button>
            <button 
              onClick={handleSpamCheck}
              disabled={loading || !subject || !content}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              INTEL SCAN
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Suggestions Panel */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Wand2 size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Hook Suggestions</h2>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Optimized for engagement</p>
              </div>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                    <span className="text-sm font-bold text-slate-700">{s}</span>
                    <button onClick={() => setSubject(s)} className="p-2 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                      <Copy size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-300">
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Awaiting content input...</p>
              </div>
            )}
          </div>

          {/* Placement prediction */}
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl">
                  <Inbox size={28} />
                </div>
                <div>
                   <h2 className="text-xl font-black">Inbox Prediction</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISP Placement Probability</p>
                </div>
             </div>

             {spamAnalysis ? (
                <div className="space-y-10">
                   <div className="flex flex-col items-center">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                         <svg className="w-full h-full -rotate-90">
                            <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                            <circle 
                               cx="96" cy="96" r="80" 
                               stroke={spamAnalysis.score > 50 ? "#f43f5e" : "#10b981"} 
                               strokeWidth="12" fill="transparent" 
                               strokeDasharray="502.4" 
                               strokeDashoffset={502.4 - (502.4 * (100 - spamAnalysis.score)) / 100}
                               strokeLinecap="round"
                               className="transition-all duration-1000"
                            />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black">{100 - spamAnalysis.score}%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">Primary Inbox</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intel Observations</h4>
                      {spamAnalysis.reasons.map((reason, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-white/5 rounded-2xl text-xs font-medium border border-white/5">
                          <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                          {reason}
                        </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="py-20 text-center opacity-30">
                   <p className="text-xs font-black uppercase tracking-widest">Run Intel Scan to visualize</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptimizer;
