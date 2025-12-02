const axios = require('axios');
const crypto = require('crypto');

// --- Configuration Variables (Accessed via process.env) ---

// Helper function to create the required Mailchimp ID
function hashEmail(email) {
    if (!email) return '';
    return crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
}

/**
 * Executes a GET request to check the current status of a member in Mailchimp.
 * Returns null if member is not found (404).
 */
async function getMailchimpMemberStatus(email) {
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_DATA_CENTER = MAILCHIMP_API_KEY ? MAILCHIMP_API_KEY.split('-')[1] : null;
    const MAILCHIMP_API_URL = MAILCHIMP_DATA_CENTER 
        ? `https://${MAILCHIMP_DATA_CENTER}.api.mailchimp.com/3.0`
        : null;

    if (!MAILCHIMP_API_URL || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_API_KEY) {
        throw new Error("Mailchimp configuration error: API Key or Audience ID missing.");
    }
    
    const emailHash = hashEmail(email);
    const url = `${MAILCHIMP_API_URL}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`any_username:${MAILCHIMP_API_KEY}`).toString('base64')}`,
            },
            // Only validate success (200), let others throw errors
            validateStatus: (status) => status === 200 || status === 404
        });

        // Member found, return their status
        if (response.status === 200) {
            return response.data.status;
        } 
        
        // Member not found (404)
        return null; 

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Explicitly handle 404
        }
        console.error("Mailchimp GET API Error:", error.response?.data?.detail || error.message);
        throw new Error(`Mailchimp failed to check status. Error: ${error.message}`);
    }
}

/**
 * Core function to perform the UPSERT (add or update status) operation on Mailchimp.
 */
async function processMailchimpAction(email, action, mergeFields = {}) {
    // Read environment variables (replicated from above for access)
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_DATA_CENTER = MAILCHIMP_API_KEY ? MAILCHIMP_API_KEY.split('-')[1] : null;
    const MAILCHIMP_API_URL = MAILCHIMP_DATA_CENTER ? `https://${MAILCHIMP_DATA_CENTER}.api.mailchimp.com/3.0` : null;

    // --- 1. CHECK EXISTENCE FIRST (New Logic) ---
    const currentStatus = await getMailchimpMemberStatus(email);
    const targetStatus = (action === 'subscribe') ? 'subscribed' : 'unsubscribed';

    if (currentStatus === targetStatus && currentStatus === 'subscribed') {
        // User already exists and is subscribed—return custom message instantly
        return { 
            success: true, 
            message: "You are already subscribed!", 
            code: 200 
        };
    }
    
    // Check if configuration is available before proceeding with PUT request
    if (!MAILCHIMP_API_URL || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_API_KEY) {
        throw new Error("Mailchimp configuration error: API Key or Audience ID missing.");
    }

    // --- 2. PERFORM PUT (Create or Update Status) ---
    
    const emailHash = hashEmail(email);
    const url = `${MAILCHIMP_API_URL}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`;
    
    const payload = {
        email_address: email,
        status: targetStatus, 
        merge_fields: mergeFields, 
    };

    try {
        const response = await axios.put(url, payload, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`any_username:${MAILCHIMP_API_KEY}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            // Accept 200, 201, 400 (for "Member Exists")
            validateStatus: (status) => status >= 200 && status < 300 || status === 400,
        });

        const data = response.data;
        
        // Final success response when status was updated or user was created
        return { 
            success: true, 
            message: data.status === 'subscribed' ? "Subscription successful!" : "Unsubscribed successfully.",
            code: response.status 
        };
        
    } catch (error) {
        const errorDetail = error.response?.data?.detail || error.message;
        console.error("Mailchimp API Error:", errorDetail);
        throw new Error(`Mailchimp failed to process request. Error: ${errorDetail}`);
    }
}


// --- Module Exports ---
module.exports = {
    processMailchimpAction
};

// ----------------------------------------------------------------------
// STANDALONE EXECUTION BLOCK (Runs with 'npm run sync:mailchimp')
// ... (The execution block remains the same for testing)
// ----------------------------------------------------------------------
if (require.main === module) {
    // Load dotenv here only for local, standalone execution
    require('dotenv').config(); 

    // --- TEST DATA DEFINITIONS ---
    const testEmail = process.env.MAILCHIMP_TEST_EMAIL || 'mytestemail123@gmail.com'; 
    const testAction = 'subscribe'; 
    
    const testMergeFields = { 
        FNAME: 'Test', 
        LNAME: 'Subject' 
    };

    console.log(`\n--- Running Mailchimp API Health Check ---`);
    console.log(`Action: ${testAction}, Target Email: ${testEmail}`);
    
    processMailchimpAction(testEmail, testAction, testMergeFields)
        .then(result => {
            if (result.success) {
                console.log(`\n✅ TEST SUCCESSFUL: ${result.message}`);
                console.log('Result Code:', result.code);
            } else {
                 console.error(`\n⚠️ TEST FAILED (Soft Error): ${result.message}`);
                 process.exitCode = 1;
            }
            console.log('---');
            process.exit(0);
        })
        .catch(error => {
            console.error(`\n❌ TEST FAILED: Mailchimp Handler Error.`);
            console.error('Error Details:', error.message);
            console.log('---');
            process.exit(1);
        });
}