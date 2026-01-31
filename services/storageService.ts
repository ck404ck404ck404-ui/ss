
/**
 * Global Storage Service for OmniSend Pro
 * Dynamically resolves API endpoint from window.API_ENDPOINT
 * Fallbacks to localStorage for static demos (Netlify/GitHub Pages)
 */

const getApiUrl = () => {
  return (window as any).API_ENDPOINT || '/api';
};

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const storage = {
  async get(action: string) {
    try {
      const url = `${getApiUrl()}${getApiUrl().includes('?') ? '&' : '?'}action=${action}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Offline");
      return await response.json();
    } catch (err) {
      // Fallback to localStorage
      const key = `omnisend_fallback_${action}`;
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : (action.includes('get_') ? [] : {});
    }
  },

  async save(action: string, data: any) {
    try {
      const url = `${getApiUrl()}${getApiUrl().includes('?') ? '&' : '?'}action=${action}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Offline");
      const result = await response.json();
      return result.success;
    } catch (err) {
      // Fallback to localStorage
      const type = action.replace('save_', '');
      const listKey = `omnisend_fallback_get_${type}s`;
      const current = JSON.parse(localStorage.getItem(listKey) || '[]');
      
      const newEntry = { 
        ...data, 
        id: data.id || Math.random().toString(36).substr(2, 9),
        added: new Date().toISOString()
      };
      
      const updated = [...current, newEntry];
      localStorage.setItem(listKey, JSON.stringify(updated));
      return true;
    }
  },

  async heartbeat() {
    try {
      const url = `${getApiUrl()}${getApiUrl().includes('?') ? '&' : '?'}action=process_sending`;
      const response = await fetch(url);
      return await response.json();
    } catch (err) {
      // Offline simulation
      return { success: true, simulated: true };
    }
  },

  async bulkImport(contacts: any[]) {
    try {
      const url = `${getApiUrl()}${getApiUrl().includes('?') ? '&' : '?'}action=bulk_import_contacts`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts })
      });
      return await response.json();
    } catch (err) {
      const listKey = `omnisend_fallback_get_contacts`;
      const current = JSON.parse(localStorage.getItem(listKey) || '[]');
      const updated = [...current, ...contacts.map(c => ({
        ...c,
        id: Math.random().toString(36).substr(2, 9),
        added: new Date().toISOString()
      }))];
      localStorage.setItem(listKey, JSON.stringify(updated));
      return { success: true, imported: contacts.length };
    }
  }
};
