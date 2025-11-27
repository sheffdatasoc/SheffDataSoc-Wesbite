import React, { useState } from 'react';
// ❌ REMOVE: Supabase is no longer the destination for newsletter signups.
// import { createClient } from '@supabase/supabase-js'; 
import { subscribeUser } from './lib/mailchimp'; // 💡 NEW: Import the subscription API function
import './NewsletterSignup.css';

// ❌ REMOVE: Supabase client initialization is deleted.
// const supabase = createClient(
// process.env.REACT_APP_SUPABASE_URL,
// process.env.REACT_APP_SUPABASE_ANON_KEY
// );

function NewsletterSignup() {
const [email, setEmail] = useState('');
const [status, setStatus] = useState(null);
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();

if (!email) {
    setStatus('Please enter a valid email.');
    return;
}

setLoading(true);
setStatus(null);

try {
    // 💡 NEW LOGIC: Call the abstracted API function.
    // The subscribeUser function handles sending FNAME/LNAME as empty strings.
    const result = await subscribeUser(email); 

    if (result.success) {
        // The message is now reliably coming from the backend:
        // Either "You are already subscribed!" OR "Subscription successful!"
        
        // 1. Handle the custom 'Already Subscribed' message for better UX
        if (result.message.includes('already subscribed')) {
            setStatus('👋 You are already subscribed!');
        } else {
            // 2. Handle the successful creation/update message
            setStatus('✅ Thank you for subscribing!');
            setEmail('');
        }
    } else {
        // Handle failure message returned from the API gateway
        console.error('API Subscription Error:', result.message);
        setStatus(`❌ Error subscribing: ${result.message}`);
    }
} catch (err) {
    console.error('Unexpected frontend error:', err);
    setStatus('⚠️ An unexpected error occurred. Please try again.');
} finally {
    setLoading(false);
}

};

return ( 
    <section className="newsletter-signup"> 
        <div className="newsletter-content"> 
            <h2>✉️ Stay in the Loop</h2> 
            <p>Subscribe to our newsletter for the latest updates on events, workshops, and opportunities in the data science community.</p> 
            <form onSubmit={handleSubmit} className="newsletter-form">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                /> 
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Subscribe'} 
                </button> 
            </form>
            {status && <p className="newsletter-status">{status}</p>} 
            <p className="newsletter-note">We respect your privacy. Unsubscribe at any time.</p> 
        </div> 
    </section>
);
}

export default NewsletterSignup;