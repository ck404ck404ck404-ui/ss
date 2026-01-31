
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  FileText, 
  Copy, 
  Trash2, 
  Edit3, 
  Search, 
  Eye, 
  Code, 
  Zap, 
  Hash, 
  User, 
  Calendar,
  Save,
  ChevronLeft,
  Layout,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { EmailTemplate } from '../types';

const initialTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Series - Onboarding',
    subject: 'Welcome to OmniSend Pro, {{NAME}}! [Ref: {{UNIQUE_NUM}}]',
    html: '<p>Hi {{NAME}},</p><p>Thanks for joining! Your unique account ID is: #{{UNIQUE_NUM}}</p>',
    usageCount: 1250,
    lastUsed: '2024-10-24 10:30'
  },
  {
    id: '2',
    name: 'Flash Sale - 50% Off',
    subject: '🔥 Limited Time Offer! {{NAME}}, grab yours now.',
    html: '<p>Grab your discount now. Use code: SALE50</p>',
    usageCount: 45000,
    lastUsed: '2024-10-20 15:45'
  }
];

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInput, setActiveInput] = useState<'subject' | 'html'>('html');
  const subjectRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setEditingTemplate(null);
  };

  const insertPlaceholder = (tag: string) => {
    if (!editingTemplate) return;

    if (activeInput === 'subject') {
      const input = subjectRef.current;
      if (!input) return;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = editingTemplate.subject;
      const newSubject = text.substring(0, start) + tag + text.substring(end);
      setEditingTemplate({ ...editingTemplate, subject: newSubject });
      // Restore focus after state update
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    } else {
      const textArea = document.getElementById('template-editor') as HTMLTextAreaElement;
      if (!textArea) return;
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = editingTemplate.html;
      const newHtml = text.substring(0, start) + tag + text.substring(end);
      setEditingTemplate({ ...editingTemplate, html: newHtml });
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingTemplate) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setEditingTemplate(null)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Template</h1>
              <p className="text-sm text-slate-500">Personalize your content with dynamic variables.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setEditingTemplate(null)}
              className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Template Name</label>
                <input 
                  type="text" 
                  value={editingTemplate.name}
                  onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                />
              </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-black text-slate-400 uppercase">Email Subject</label>
                  <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                    <Sparkles size={10} /> Supports Variables
                  </span>
                </div>
                <input 
                  ref={subjectRef}
                  type="text" 
                  value={editingTemplate.subject}
                  onFocus={() => setActiveInput('subject')}
                  onChange={e => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                  className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:ring-0 text-sm font-medium transition-colors ${
                    activeInput === 'subject' ? 'border-indigo-500 bg-white' : 'border-transparent'
                  }`}
                  placeholder="Enter subject... (Tip: use {{UNIQUE_NUM}} for uniqueness)"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600">
                    <Code size={16} />
                  </button>
                  <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600">
                    <Layout size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                  <Zap size={14} className="text-amber-500" />
                  Auto-saving Active
                </div>
              </div>
              <textarea 
                id="template-editor"
                onFocus={() => setActiveInput('html')}
                className={`flex-1 p-6 font-mono text-sm resize-none focus:ring-0 border-none transition-colors ${
                  activeInput === 'html' ? 'bg-slate-900 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}
                value={editingTemplate.html}
                onChange={e => setEditingTemplate({...editingTemplate, html: e.target.value})}
                placeholder="<html>Write your email code here...</html>"
              ></textarea>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Hash size={16} className="text-indigo-500" />
                Variable Injector
              </h2>
              <p className="text-xs text-slate-500 mb-6 italic">
                Inserting into: <span className="font-black text-indigo-600 uppercase">{activeInput}</span>
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Recipient Name', tag: '{{NAME}}', icon: <User size={14}/>, color: 'text-sky-600 bg-sky-50' },
                  { label: 'Recipient Email', tag: '{{EMAIL}}', icon: <FileText size={14}/>, color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Unique ID (Anti-Spam)', tag: '{{UNIQUE_NUM}}', icon: <Hash size={14}/>, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Current Date', tag: '{{DATE}}', icon: <Calendar size={14}/>, color: 'text-emerald-600 bg-emerald-50' },
                ].map((variable) => (
                  <button 
                    key={variable.tag}
                    onClick={() => insertPlaceholder(variable.tag)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${variable.color}`}>
                        {variable.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{variable.label}</span>
                    </div>
                    <code className="text-[10px] font-black text-slate-400 group-hover:text-indigo-500">{variable.tag}</code>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-900 rounded-xl text-white">
                <h3 className="text-xs font-black uppercase mb-2 flex items-center gap-2 text-indigo-400">
                  <Info size={14} />
                  Deliverability Tip
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Adding <code className="text-indigo-300">{"{{UNIQUE_NUM}}"}</code> or <code className="text-indigo-300">{"{{NAME}}"}</code> to your subject line forces each email to be unique. This significantly reduces the risk of being flagged by ISP spam filters.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Personalized Preview</h2>
              <div className="aspect-[3/4] bg-slate-50 rounded-xl border border-slate-100 p-4 overflow-y-auto">
                <div className="text-[10px] text-slate-400 mb-4 pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900">To:</span> john@example.com<br/>
                  <span className="font-bold text-slate-900">Subject:</span> {
                    editingTemplate.subject
                      .replace(/\{\{NAME\}\}/g, 'John Doe')
                      .replace(/\{\{EMAIL\}\}/g, 'john@example.com')
                      .replace(/\{\{UNIQUE_NUM\}\}/g, Math.floor(Math.random() * 999999).toString())
                      .replace(/\{\{DATE\}\}/g, new Date().toLocaleDateString())
                  }
                </div>
                <div 
                  className="text-sm prose prose-sm max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ 
                    __html: editingTemplate.html
                      .replace(/\{\{NAME\}\}/g, 'John Doe')
                      .replace(/\{\{EMAIL\}\}/g, 'john@example.com')
                      .replace(/\{\{UNIQUE_NUM\}\}/g, '849201')
                      .replace(/\{\{DATE\}\}/g, new Date().toLocaleDateString())
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Templates</h1>
          <p className="text-slate-500">Create layouts with dynamic anti-spam subject lines.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Plus size={18} />
          <span>Create Template</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative flex-1 lg:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <select className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 shadow-sm">
          <option>All Categories</option>
          <option>Marketing</option>
          <option>Transactional</option>
          <option>Personal</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">{template.usageCount.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase">Uses</div>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
              <p className="text-xs text-slate-500 mb-6 line-clamp-1">{template.subject}</p>
              
              <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-slate-400">
                <Clock size={12} />
                <span>Last used {template.lastUsed}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    setEditingTemplate(template);
                    setActiveInput('html');
                  }}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex justify-center"
                >
                  <Edit3 size={18} />
                </button>
                <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors flex justify-center">
                  <Copy size={18} />
                </button>
                <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors flex justify-center">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HTML Responsive</span>
              <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                Preview <Eye size={14} />
              </button>
            </div>
          </div>
        ))}

        <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-indigo-50 hover:border-indigo-200 transition-all group min-h-[250px]">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900">Add New Template</p>
            <p className="text-xs text-slate-500">Drag & drop or start from scratch</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TemplateManager;
