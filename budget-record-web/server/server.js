const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8888;

const BACKUP_FILE = path.join(__dirname, 'backup.json');

app.use(cors());
app.use(express.json());

const loadBackup = () => {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const data = fs.readFileSync(BACKUP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading backup:', error);
  }
  return { records: [], lastSync: null };
};

const saveBackup = (data) => {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving backup:', error);
    return false;
  }
};

app.get('/api/backup', (req, res) => {
  const backup = loadBackup();
  res.json({
    success: true,
    data: backup
  });
});

app.post('/api/backup', (req, res) => {
  const { records } = req.body;
  
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid records format'
    });
  }

  const backupData = {
    records,
    lastSync: new Date().toISOString()
  };

  const saved = saveBackup(backupData);
  
  if (saved) {
    res.json({
      success: true,
      message: 'Backup saved successfully',
      syncTime: backupData.lastSync,
      recordCount: records.length
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to save backup'
    });
  }
});

app.delete('/api/backup', (req, res) => {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      fs.unlinkSync(BACKUP_FILE);
    }
    res.json({
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete backup'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Budget Record API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Budget Record Server is running on http://localhost:${PORT}`);
  console.log(`Backup file: ${BACKUP_FILE}`);
});
