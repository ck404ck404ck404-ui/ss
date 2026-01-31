
/**
 * Global Storage Service for OmniSend Pro
 * Optimized for Node.js Environment
 */

const API_URL = '/api';

export const storage = {
  async get(action: string) {
    try {
      const response = await fetch(`${API_URL}?action=${action}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (err) {
      console.error("Storage Read Error:", err);
      return [];
    }
  },

  async save(action: string, data: any) {
    try {
      const response = await fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.success;
    } catch (err) {
      console.error("Storage Save Error:", err);
      return false;
    }
  },

  async heartbeat() {
    try {
      const response = await fetch(`${API_URL}?action=process_sending`);
      return await response.json();
    } catch (err) {
      return { success: false };
    }
  },

  async bulkImport(contacts: any[]) {
    try {
      const response = await fetch(`${API_URL}?action=bulk_import_contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts })
      });
      return await response.json();
    } catch (err) {
      console.error("Bulk Import Error:", err);
      return { success: false };
    }
  }
};
