require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { syncAllData } = require('./syncNotion');
const { processMailchimpAction } = require('./syncMailchimp');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Manual sync endpoint (Notion -> Supabase)
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

// Mailchimp API Gateway Endpoint
app.post('/api/mailchimp', async (req, res) => {
    const { email, action, mergeFields } = req.body;

    if (!email || !action) {
        return res.status(400).json({ success: false, message: 'Missing email or action parameter.' });
    }

    try {
        // Call the secure backend function
        const result = await processMailchimpAction(email, action, mergeFields);

        res.status(result.code || 200).json(result);
    } catch (error) {
        console.error('Mailchimp API Route failed:', error.message);
        res.status(500).json({ success: false, message: error.message });
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

// --- Scheduling ---

// Setup automatic sync with cron
const SYNC_SCHEDULE = process.env.SYNC_SCHEDULE || '*/5 * * * *';

console.log(`\n⏰ Setting up automatic sync: ${SYNC_SCHEDULE}`);
console.log('   (Every 5 minutes)\n');

/*
cron.schedule(SYNC_SCHEDULE, async () => {
  console.log(`\n⏰ Scheduled sync triggered at ${new Date().toISOString()}`);
  try {
    await syncAllData();
  } catch (error) {
    console.error('Scheduled sync failed:', error);
  }
});
*/

// --- Server Startup ---

// 💡 FIX: Start server IMMEDIATELY to avoid Render cold-start + sync delays.
// Initial sync will run in the background.
app.listen(PORT, () => {
    console.log(`\n🌐 Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Manual sync: POST http://localhost:${PORT}/api/sync`);
    console.log(`   Mailchimp API: POST http://localhost:${PORT}/api/mailchimp`);
    console.log(`   Sync status: http://localhost:${PORT}/api/sync/status\n`);

    console.log('🚀 Triggering initial sync in background...\n');
    syncAllData()
        .then(() => {
            console.log('✅ Initial background sync complete\n');
        })
        .catch((error) => {
            console.error('❌ Initial background sync failed:', error);
            console.log('⚠️  Server will continue running. Scheduled syncs will retry.\n');
        });
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