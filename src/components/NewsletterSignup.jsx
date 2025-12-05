import React, { useState, useEffect } from 'react';
import { subscribeUser } from '../lib/mailchimp';
import './NewsletterSignup.css';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Optional: Debounce email checking
  useEffect(() => {
    if (!email) {
      return;
    }
    // Simple status reset when email changes
    setStatus(null);
  }, [email]);

  // Async form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('Please enter a valid email.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await subscribeUser(email);
      
      if (result.success) {
        if (result.message.includes('already subscribed')) {
          setStatus('👋 You are already subscribed!');

        } else {
          setStatus('✅ Thank you for subscribing!');
          setEmail('');
        }
      } else {
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
        <p>
          Subscribe to our newsletter for the latest updates on events, workshops, and opportunities in the data science community.
        </p>
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