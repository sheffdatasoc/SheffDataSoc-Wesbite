require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { syncAllData } = require('./syncNotion');
const { processMailchimpAction } = require('./syncMailchimp');
const chatClient = require('./ibmWatsonxClient');

// Global sync state
let lastSyncStatus = {
    lastRun: null,
    status: 'Initializing',
    results: null
};

const app = express();
const PORT = process.env.PORT || 10000; // Render's preferred port

// Allowed origins
const ALLOWED_ORIGINS = [
    'https://sheffdatasoc.org',
    'https://www.sheffdatasoc.org',
    'http://localhost:5173',
    'http://localhost:3000',
];

// 1. CORS
app.use((req, res, next) => {
    const origin = req.get('origin');
    console.log(`[Sheff Backend] ${req.method} request from origin: ${origin || 'Unknown'}`);

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (origin) {
        // Reject unknown origins
        return res.status(403).json({ error: 'CORS: origin not allowed' });
    }

    // Handle preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        console.log(`[Sheff Backend] Responding to OPTIONS preflight`);
        return res.sendStatus(204);
    }
    next();
});

// 2. Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; frame-ancestors 'none'"
    );
    next();
});

// Simple in-memory rate limiter for /api/chat (20 req/min per IP)
const chatRateLimitMap = new Map();
const CHAT_RATE_LIMIT = 20;
const CHAT_RATE_WINDOW_MS = 60 * 1000;

// Periodically evict expired entries to prevent unbounded memory growth
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of chatRateLimitMap.entries()) {
        if (now > entry.resetAt) chatRateLimitMap.delete(ip);
    }
}, CHAT_RATE_WINDOW_MS);

function chatRateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const entry = chatRateLimitMap.get(ip) || { count: 0, resetAt: now + CHAT_RATE_WINDOW_MS };

    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + CHAT_RATE_WINDOW_MS;
    }

    entry.count += 1;
    chatRateLimitMap.set(ip, entry);

    if (entry.count > CHAT_RATE_LIMIT) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please wait a moment.' });
    }
    next();
}

// 3. Regular middleware
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
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!process.env.SYNC_SECRET || token !== process.env.SYNC_SECRET) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    try {
        console.log('Manual sync triggered via API');
        lastSyncStatus.status = 'Running (Manual)';
        const results = await syncAllData();

        lastSyncStatus.lastRun = new Date().toISOString();
        lastSyncStatus.status = 'Success';
        lastSyncStatus.results = results;

        res.json({
            success: true,
            message: 'Sync completed successfully',
            results
        });
    } catch (error) {
        lastSyncStatus.status = 'Failed (Manual)';
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
        schedule: SYNC_SCHEDULE,
        lastRun: lastSyncStatus.lastRun,
        status: lastSyncStatus.status,
        nextRun: cron.getTasks().size > 0 ? 'Scheduled' : 'Inactive',
        serverTime: new Date().toISOString()
    });
});

// ChatBot API Endpoint (IBM Granite)
app.post('/api/chat', chatRateLimit, async (req, res) => {
    const { prompt, history } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    try {
        const response = await chatClient.generateResponse(prompt, history || []);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Chat API failed:', error.message);
        res.status(500).json({ success: false, message: 'Failed to generate response from IBM Granite' });
    }
});

// --- Scheduling ---

// Setup automatic sync with cron
const SYNC_SCHEDULE = process.env.SYNC_SCHEDULE || '*/5 * * * *';

console.log(`\n⏰ Setting up automatic sync: ${SYNC_SCHEDULE}`);
console.log('   (Every 5 minutes)\n');

cron.schedule(SYNC_SCHEDULE, async () => {
    console.log(`\n⏰ Scheduled sync triggered at ${new Date().toISOString()}`);
    try {
        lastSyncStatus.status = 'Running (Scheduled)';
        const results = await syncAllData();
        lastSyncStatus.lastRun = new Date().toISOString();
        lastSyncStatus.status = 'Success';
        lastSyncStatus.results = results;
    } catch (error) {
        lastSyncStatus.status = 'Failed (Scheduled)';
        console.error('Scheduled sync failed:', error);
    }
});

// 💓 Heartbeat / Keep-Alive Mechanism (for Render Free Plan)
// Render Free Plan spins down after 15 minutes of inactivity.
// Internal cron jobs do NOT count as activity.
// This self-ping runs every 10 minutes to keep the instance alive.
const axios = require('axios');
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

if (RENDER_EXTERNAL_URL) {
    console.log(`💓 Heartbeat configured: Ping every 10 mins to ${RENDER_EXTERNAL_URL}/health`);
    cron.schedule('*/10 * * * *', async () => {
        try {
            console.log(`💓 Sending heartbeat ping to keep Render instance alive...`);
            await axios.get(`${RENDER_EXTERNAL_URL}/health`);
            console.log('✅ Heartbeat successful');
        } catch (error) {
            console.error('❌ Heartbeat failed:', error.message);
        }
    });
} else {
    console.log('⚠️  RENDER_EXTERNAL_URL not set. Heartbeat disabled (Local development).');
}

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
    lastSyncStatus.status = 'Running (Initial)';
    syncAllData()
        .then((results) => {
            const total = Object.values(results || {})
                .filter(r => r && typeof r === 'object')
                .reduce((sum, r) => sum + (r.count || 0), 0);
            console.log(`✅ Initial background sync complete (${total} records)\n`);
            lastSyncStatus.lastRun = new Date().toISOString();
            lastSyncStatus.status = 'Success';
            lastSyncStatus.results = results;
        })
        .catch((error) => {
            lastSyncStatus.status = 'Failed (Initial)';
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