import React, { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser } from '../lib/mailchimp';
import './NewsletterSignup.css';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset status when email changes
  useEffect(() => {
    if (email) setStatus(null);
  }, [email]);

  // Subscribe handler
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
        // ✅ NEW: Handle different response messages
        if (result.message.includes('check your email')) {
          setStatus('📧 Almost there! Please check your email to confirm your subscription.');
        } else if (result.message.includes('already subscribed')) {
          setStatus('👋 You are already subscribed!');
        } else {
          setStatus('✅ Thank you for subscribing!');
          setEmail('');
        }
      } else {
        setStatus(`❌ Error subscribing: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('⚠️ An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe handler
  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('Please enter your email to unsubscribe.');
      return;
    }

    const confirmUnsub = window.confirm(
      `Are you sure you want to unsubscribe ${email}?`
    );

    if (!confirmUnsub) return;

    setLoading(true);
    setStatus(null);

    try {
      const result = await unsubscribeUser(email);

      if (result.success) {
        setStatus('✅ You have been unsubscribed.');
        setEmail('');
      } else {
        setStatus(`❌ Error unsubscribing: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('⚠️ An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-signup-section">
      <div className="newsletter-signup">
        <div className="newsletter-content">
          <h2>✉️ Stay in the Loop</h2>
          <p>
            Subscribe to our newsletter for the latest updates on events,
            workshops, and opportunities in the data science community.
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

          <p className="newsletter-note">
            We respect your privacy.{' '}
            <span
              className="unsubscribe-link"
              onClick={handleUnsubscribe}
            >
              Unsubscribe
            </span>{' '}
            at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSignup;
