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
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_DATA_CENTER = MAILCHIMP_API_KEY ? MAILCHIMP_API_KEY.split('-')[1] : null;
    const MAILCHIMP_API_URL = MAILCHIMP_DATA_CENTER ? `https://${MAILCHIMP_DATA_CENTER}.api.mailchimp.com/3.0` : null;

    if (!MAILCHIMP_API_URL || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_API_KEY) {
        throw new Error("Mailchimp configuration error: API Key or Audience ID missing.");
    }

    // --- STEP 1: Check Current Status ---
    const currentStatus = await getMailchimpMemberStatus(email);
    
    // --- STEP 2: Validation Logic ---
    if (action === 'unsubscribe') {
        if (!currentStatus) {
            return { 
                success: false, 
                message: "Error: This email address was not found in our list.", 
                code: 404 
            };
        }
        if (currentStatus === 'unsubscribed' || currentStatus === 'cleaned') {
            return { 
                success: false, 
                message: "You are already unsubscribed from our newsletter.", 
                code: 409 
            };
        }
    }

    if (action === 'subscribe') {
        if (currentStatus === 'subscribed') {
            return { 
                success: true, 
                message: "You are already subscribed!", 
                code: 200 
            };
        }
    }

    // --- STEP 3: Determine Target Status (THE FIX IS HERE) ---
    let targetStatus;
    if (action === 'subscribe') {
        // FIX: If they are 'unsubscribed' OR 'pending', we must set them to 'pending'.
        // This prevents 'pending' users from bypassing the email check by clicking twice.
        if (currentStatus === 'unsubscribed' || currentStatus === 'pending') {
            targetStatus = 'pending';
        } else {
            // New users: Default to 'subscribed' (Single Opt-in).
            // (If you want Double Opt-in for everyone, change this to 'pending')
            targetStatus = 'subscribed';
        }
    } else {
        targetStatus = 'unsubscribed';
    }

    // --- STEP 4: Send PUT Request ---
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
            validateStatus: (status) => status >= 200 && status < 300 || status === 400,
        });

        const data = response.data;
        
        let message;
        if (data.status === 'subscribed') {
            message = "Subscription successful!";
        } else if (data.status === 'pending') {
            message = "Please check your email to confirm your subscription!";
        } else {
            message = "Unsubscribed successfully.";
        }
        
        return { 
            success: true, 
            message: message,
            code: response.status 
        };
        
    } catch (error) {
        const errorDetail = error.response?.data?.detail || error.message;
        console.error("Mailchimp API Error:", errorDetail);
        throw new Error(`Mailchimp action failed: ${errorDetail}`);
    }
}

module.exports = { processMailchimpAction };

// ----------------------------------------------------------------------
// STANDALONE EXECUTION BLOCK (Runs with 'npm run sync:mailchimp')
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