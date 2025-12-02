import React, { useState } from 'react';
// ❌ REMOVE: Supabase code is deleted.

// 💡 FIX: Changed './lib/mailchimp' to '../lib/mailchimp'
// The component moves up one directory (../) to find the 'lib' folder inside 'src/'.
import { subscribeUser } from '../lib/mailchimp'; 
import './NewsletterSignup.css';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Debounce email checking
  useEffect(() => {
    if (!email) {
      setExists(false);
      return;
    }

if (!email) {
    setStatus('Please enter a valid email.');
    return;
}

    return () => clearTimeout(timeoutId);
  }, [email]);

try {
    // Calling the abstracted API function.
    const result = await subscribeUser(email); 

    if (result.success) {
        // The message is now reliably coming from the backend.
        
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