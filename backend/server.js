require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { syncAllData } = require('./syncNotion');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Manual sync endpoint
app.post('/api/sync', async (req, res) => {
  try {
    console.log('Manual sync triggered via API');
    const results = await syncAllData();
    res.json({ 
      success: true, 
      message: 'Sync completed successfully',
      results 
    });
  } catch (error) {
    console.error('Manual sync failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get sync status endpoint
app.get('/api/sync/status', (req, res) => {
  res.json({
    schedule: '*/5 * * * *', // Every 5 minutes
    nextRun: cron.getTasks().size > 0 ? 'Active' : 'No scheduled tasks',
    serverTime: new Date().toISOString()
  });
});

// Setup automatic sync with cron
// Default: Every 5 minutes - adjust as needed
const SYNC_SCHEDULE = process.env.SYNC_SCHEDULE || '*/5 * * * *';

console.log(`\n⏰ Setting up automatic sync: ${SYNC_SCHEDULE}`);
console.log('   (Every 5 minutes)\n');

cron.schedule(SYNC_SCHEDULE, async () => {
  console.log(`\n⏰ Scheduled sync triggered at ${new Date().toISOString()}`);
  try {
    await syncAllData();
  } catch (error) {
    console.error('Scheduled sync failed:', error);
  }
});

// Run initial sync on startup
console.log('🚀 Running initial sync on startup...\n');
syncAllData()
  .then(() => {
    console.log('✅ Initial sync complete\n');
  })
  .catch((error) => {
    console.error('❌ Initial sync failed:', error);
    console.log('⚠️  Server will continue running. Scheduled syncs will retry.\n');
    // Don't exit - let scheduled syncs retry
  });

// Start server
app.listen(PORT, () => {
  console.log(`\n🌐 Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Manual sync: POST http://localhost:${PORT}/api/sync`);
  console.log(`   Sync status: http://localhost:${PORT}/api/sync/status\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});