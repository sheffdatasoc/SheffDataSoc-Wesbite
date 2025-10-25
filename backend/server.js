require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { syncAllData } = require('./syncNotion');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server running' });
});

// Manual sync trigger endpoint
app.post('/sync', async (req, res) => {
  try {
    console.log('Manual sync triggered');
    await syncAllData();
    res.json({ success: true, message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule automatic sync every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled sync...');
  try {
    await syncAllData();
    console.log('Scheduled sync completed');
  } catch (error) {
    console.error('Scheduled sync failed:', error);
  }
});

// Run initial sync on startup
(async () => {
  console.log('Running initial sync...');
  try {
    await syncAllData();
    console.log('Initial sync completed');
  } catch (error) {
    console.error('Initial sync failed:', error);
  }
})();

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Automatic sync scheduled to run every hour');
});