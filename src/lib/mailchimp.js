// src/lib/mailchimp.js
import config from '../config';

// Define the public API endpoint URL exposed by your Express server
const MAILCHIMP_ENDPOINT = `${config.apiUrl}/api/mailchimp`; 

/**
 * Executes a subscription or unsubscription action by calling the secure backend endpoint.
 * @param {string} email - The user's email address.
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

        // Handle network errors (e.g., server down, 500 error)
        if (!response.ok) {
            throw new Error(`Server connection failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        // CHECK: If the backend says success: false (e.g. "Email not found"),
        // we throw an error here so it goes to the catch block below.
        if (!result.success) {
            throw new Error(result.message);
        }

        return result;

    } catch (error) {
        // Log the error and return a standardized failure object to the UI
        console.error(`Mailchimp API Error for ${action}:`, error.message);
        
        // This message will be displayed to the user (e.g. "Error: This email address was not found...")
        return { success: false, message: error.message };
    }
}


// --- Exported Functions ---

/**
 * Subscribes a user to Mailchimp.
 * Sends empty strings for FNAME/LNAME to satisfy Mailchimp requirements without user input.
 */
export async function subscribeUser(email) {
    // Collect the merge fields, sending empty strings to satisfy Mailchimp's 'Required' settings
    const mergeFields = {
        FNAME: '', 
        LNAME: '' 
    };
    return mailchimpApiRequest(email, 'subscribe', mergeFields);
}

/**
 * Unsubscribes a user from Mailchimp.
 */
export async function unsubscribeUser(email) {
    // Backend handles the specific lookup logic now.
    // We pass empty mergeFields to match the expected API signature.
    const mergeFields = {}; 
    return mailchimpApiRequest(email, 'unsubscribe', mergeFields);
}