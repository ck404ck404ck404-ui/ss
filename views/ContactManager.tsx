
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, UserPlus, RefreshCw, X, AlertTriangle, FileUp, Download, CheckCircle2, Trash2
} from 'lucide-react';
import { storage } from '../services/storageService.ts';

const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', group: 'General' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await storage.get('get_contacts');
    setContacts(data || []);
    setLoading(false);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.email) return;
    setLoading(true);
    const success = await storage.save('save_contact', newContact);
    if (success) {
      setShowAddModal(false);
      setNewContact({ name: '', email: '', group: 'General' });
      load();
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newContacts = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        if (values.length < 1) return null;
        
        const contact: any = { group: 'Imported' };
        headers.forEach((header, idx) => {
          if (header.includes('email')) contact.email = values[idx];
          if (header.includes('name')) contact.name = values[idx];
        });
        
        return contact.email ? contact : null;
      }).filter(c => c !== null);

      if (newContacts.length > 0) {
        setLoading(true);
        const result = await storage.bulkImport(newContacts);
        if (result.success) {
          alert(`Successfully imported ${result.imported} contacts!`);
          load();
        }
        setLoading(false);
        setShowImportModal(false);
      }
    };
    reader.readAsText(file);
  };

  const filteredContacts = (contacts || []).filter(c => 
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Management</h1>
          <p className="text-slate-500">Total: {contacts.length} recipients stored on server.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileUp size={20} />
            <span>Bulk Import</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <UserPlus size={20} />
            <span>Add Recipient</span>
          </button>
        </div>
      </header>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Import CSV</h2>
                <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
             </div>
             <div className="space-y-6">
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
               >
                 <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                   <FileUp size={32} />
                 </div>
                 <div className="text-center">
                   <p className="font-bold text-slate-900">Click to Upload CSV</p>
                   <p className="text-xs text-slate-500">Must contain an 'email' column</p>
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept=".csv" 
                   onChange={handleFileUpload}
                 />
               </div>
               <div className="bg-amber-50 p-4 rounded-2xl flex gap-3">
                 <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                 <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                   Ensure your CSV is UTF-8 encoded. The first row should contain headers like "Email", "Name".
                 </p>
               </div>
             </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">New Contact</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
             </div>
             <form onSubmit={handleAddContact} className="space-y-4">
                <input required placeholder="Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                <input required type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
                <input required placeholder="Group" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newContact.group} onChange={e => setNewContact({...newContact, group: e.target.value})} />
                <button disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
                   {loading && <RefreshCw size={16} className="animate-spin"/>} Save Recipient
                </button>
             </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
          </div>
          <button className="px-6 py-4 bg-white text-slate-400 rounded-2xl hover:text-rose-500 transition-colors shadow-sm">
             <Trash2 size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Group</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContacts.map((contact, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{contact.name || 'No Name'}</div>
                    <div className="text-xs text-slate-500">{contact.email}</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
                       <CheckCircle2 size={10} /> Active
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{contact.group}</span>
                  </td>
                  <td className="px-8 py-6 text-right text-xs text-slate-400 font-bold tabular-nums">{contact.added}</td>
                </tr>
              ))}
              {filteredContacts.length === 0 && !loading && (
                <tr><td colSpan={4} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-slate-300">
                    <Search size={48} className="opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">No records found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
