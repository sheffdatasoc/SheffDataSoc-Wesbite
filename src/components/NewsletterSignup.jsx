import React, { useState } from 'react';
import { subscribeUser, unsubscribeUser } from '../lib/mailchimp';
import './NewsletterSignup.css';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const [showUnsubModal, setShowUnsubModal] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (status.message) setStatus({ message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ message: 'Please enter a valid email.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const result = await subscribeUser(email);

      if (result.success) {
        if (result.message.includes('check your email')) {
          setStatus({ 
            message: '📧 Almost there! Please check your email to confirm.', 
            type: 'success' 
          });
        } else if (result.message.includes('already subscribed')) {
          setStatus({ 
            message: '👋 You are already subscribed!', 
            type: 'success' 
          });
        } else {
          setStatus({ 
            message: '✅ Thank you for subscribing!', 
            type: 'success' 
          });
          setEmail('');
        }
      } else {
        setStatus({ 
          message: `❌ Error: ${result.message}`, 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ 
        message: '⚠️ An unexpected error occurred.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 1. Triggered when clicking "Unsubscribe"
  const requestUnsubscribe = () => {
    if (!email) {
      setStatus({ 
        message: 'Please enter your email above to unsubscribe.', 
        type: 'error' 
      });
      return;
    }
    setShowUnsubModal(true);
  };

  // 2. Triggered by "Yes" in modal
  const confirmUnsubscribe = async () => {
    setShowUnsubModal(false);
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const result = await unsubscribeUser(email);

      // --- NEW LOGIC STARTS HERE ---
      if (result.success) {
        // CASE: Successfully Unsubscribed
        setStatus({ 
          message: '👋 Hope to see you again!', 
          type: 'success' 
        });
        setEmail('');
      } else {
        // CASE: Error or Info returned from Backend
        const msg = result.message.toLowerCase();

        if (msg.includes('not found')) {
          // Specific message for non-existent emails
          setStatus({ 
            message: '⚠️ We couldn\'t find that email in our list.', 
            type: 'error' 
          });
        } else if (msg.includes('already unsubscribed')) {
          // Specific message for already unsubscribed
          setStatus({ 
            message: 'ℹ️ You are already unsubscribed.', 
            type: 'info' // You can style .newsletter-status.info in CSS
          });
        } else {
          // Fallback for other errors
          setStatus({ 
            message: `❌ ${result.message}`, 
            type: 'error' 
          });
        }
      }
      // --- NEW LOGIC ENDS HERE ---

    } catch (err) {
      console.error(err);
      setStatus({ 
        message: '⚠️ An unexpected error occurred.', 
        type: 'error' 
      });
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
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Subscribe'}
            </button>
          </form>

          {/* This displays the status message */}
          {status.message && (
            <p className={`newsletter-status ${status.type}`}>
              {status.message}
            </p>
          )}

          <p className="newsletter-note">
            We respect your privacy.{' '}
            <span
              className="unsubscribe-link"
              onClick={requestUnsubscribe}
              role="button"
              tabIndex="0"
            >
              Unsubscribe
            </span>{' '}
            at any time.
          </p>
        </div>
      </div>

      {showUnsubModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Unsubscribe?</h3>
            <p>Are you sure you want to remove <strong>{email}</strong> from our list?</p>
            
            <div className="modal-buttons">
              <button onClick={confirmUnsubscribe}>
                Yes, Unsubscribe
              </button>
              <button onClick={() => setShowUnsubModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default NewsletterSignup;