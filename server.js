
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Browser-এ JSX/TSX সাপোর্ট করার জন্য MIME টাইপ সেট করা
express.static.mime.define({
  'application/javascript': ['ts', 'tsx', 'jsx', 'js']
});

// স্ট্যাটিক ফাইল সার্ভ করা
app.use(express.static(__dirname));

// ডাটা ডিরেক্টরি চেক
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// JSON ডাটা হ্যান্ডলিং হেল্পার
const getJson = (filename) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) || [];
  } catch (e) { return []; }
};

const saveJson = (filename, data) => {
  fs.writeFileSync(path.join(DATA_DIR, `${filename}.json`), JSON.stringify(data, null, 2));
};

// API Routes
app.get('/api', (req, res) => {
  const action = req.query.action;
  if (action === 'check_status') {
    return res.json({ installed: true, storage_writable: true, platform: 'Node.js' });
  }
  const type = action.startsWith('get_') ? action.replace('get_', '') : null;
  if (type) return res.json(getJson(type));
  
  if (action === 'process_sending') {
    // সিমুলেশন লজিক (সংক্ষিপ্ত)
    res.json({ success: true, processed: 1 });
    return;
  }
  res.status(400).json({ error: 'Invalid action' });
});

app.post('/api', (req, res) => {
  const action = req.query.action;
  const filename = action.replace('save_', '').replace('bulk_import_', '');
  let currentData = getJson(filename);
  
  if (action === 'bulk_import_contacts') {
    const incoming = req.body.contacts || [];
    currentData = [...currentData, ...incoming.map(c => ({ ...c, id: Date.now() + Math.random(), added: new Date().toISOString() }))];
  } else {
    currentData.push({ ...req.body, id: Date.now().toString(), added: new Date().toISOString() });
  }
  
  saveJson(filename, currentData);
  res.json({ success: true });
});

// SPA এর জন্য সব রিকোয়েস্ট index.html-এ পাঠানো
app.get('*', (req, res) => {
  if (req.url.includes('.')) return res.status(404).end();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 OmniSend Pro is running at http://localhost:${PORT}`);
});
