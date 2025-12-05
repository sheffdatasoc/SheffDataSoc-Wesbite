// src/lib/mailchimp.js
import config from '../config';

// Define the public API endpoint URL exposed by your Express server (server.js)
const MAILCHIMP_ENDPOINT = `${config.apiUrl}/api/mailchimp`; 

/**
 * Executes a subscription or unsubscription action by calling the secure backend endpoint.
 * * @param {string} email - The user's email address.
 * @param {'subscribe' | 'unsubscribe'} action - The action to perform.
 * @param {object} [mergeFields={}] - Optional data like { FNAME: '...', LNAME: '...' }.
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function mailchimpApiRequest(email, action, mergeFields = {}) {
    try {
        const response = await fetch(MAILCHIMP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The body sends the necessary data to your secure Express endpoint
            body: JSON.stringify({ 
                email: email, 
                action: action, 
                mergeFields: mergeFields 
            }),
        });

        // Handle network errors or server connection issues
        if (!response.ok) {
            // Throw an error that includes the status code if the HTTP call failed (e.g., 500)
            throw new Error(`Server connection failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        // Check the success flag returned by your Express route
        if (!result.success) {
            // Throw an error if the backend/Mailchimp reported a failure
            throw new Error(result.message);
        }

        return result;

    } catch (error) {
        // Log the error and return a standardized failure object
        console.error(`Mailchimp API Error for ${action}:`, error.message);
        return { success: false, message: error.message };
    }
}


// --- Exported Functions (Mirroring your Supabase pattern) ---

/**
 * Subscribes a user to Mailchimp, sending only the email.
 * This function now internally provides empty strings for required merge fields (FNAME/LNAME).
 */
export async function subscribeUser(email) { // 💡 SIMPLIFIED: Removed firstName, lastName arguments
    // Collect the merge fields, sending empty strings to satisfy Mailchimp's 'Required' settings
    const mergeFields = {
        FNAME: '', // Sending empty string
        LNAME: ''  // Sending empty string
    };
    // The component will now only pass the email
    return mailchimpApiRequest(email, 'subscribe', mergeFields);
}

/**
 * Unsubscribes a user from Mailchimp.
 */
export async function unsubscribeUser(email) {
    // For unsubscribe, we also need to send mergeFields, even if empty,
    // as the mailchimpApiRequest expects a mergeFields argument in the core request structure.
    const mergeFields = {}; 
    return mailchimpApiRequest(email, 'unsubscribe', mergeFields);
}