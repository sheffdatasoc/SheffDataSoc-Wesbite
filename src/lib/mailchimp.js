// src/lib/mailchimp.js
import config from '../config';

const MAILCHIMP_ENDPOINT = `${config.apiUrl}/api/mailchimp`; 

async function mailchimpApiRequest(email, action, mergeFields = {}) {
    try {
        const response = await fetch(MAILCHIMP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email, 
                action: action, 
                mergeFields: mergeFields 
            }),
        });

        // 1. Attempt to parse the JSON response first, regardless of status code.
        //    (Because your backend sends useful JSON even on 404 or 409 errors).
        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            // If parsing fails (e.g. server crashed and sent HTML), fallback to status text
            throw new Error(`Server connection failed with status: ${response.status}`);
        }

        // 2. Now check if the request failed (HTTP error OR logical error)
        if (!response.ok || !result.success) {
            // Prefer the specific message from the backend (e.g., "You are already unsubscribed")
            if (result && result.message) {
                throw new Error(result.message);
            }
            // Fallback if no message exists
            throw new Error(`Request failed with status: ${response.status}`);
        }

        return result;

    } catch (error) {
        console.error(`Mailchimp API Error for ${action}:`, error.message);
        return { success: false, message: error.message };
    }
}

// --- Exported Functions ---

export async function subscribeUser(email) {
    const mergeFields = { FNAME: '', LNAME: '' };
    return mailchimpApiRequest(email, 'subscribe', mergeFields);
}

export async function unsubscribeUser(email) {
    const mergeFields = {}; 
    return mailchimpApiRequest(email, 'unsubscribe', mergeFields);
}