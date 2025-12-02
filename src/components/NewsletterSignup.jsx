import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './NewsletterSignup.css';

// Initialize Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

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

    const timeoutId = setTimeout(() => {
      checkEmail(email);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  // Check if email is already subscribed
  const checkEmail = async (emailToCheck) => {
    setCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', emailToCheck)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - not an error in our case
        console.error('Check email error:', error);
        setExists(false);
      } else {
        setExists(!!data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setStatus(null); // Clear status when user types
  };

  const handleToggleSubscription = async (e) => {
    e.preventDefault();
    
    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      if (exists) {
        // Unsubscribe - delete record from Supabase
        const confirmed = window.confirm(
          `Are you sure you want to unsubscribe ${email} from the newsletter?`
        );
        
        if (!confirmed) {
          setLoading(false);
          return;
        }

        const { error } = await supabase
          .from('newsletter')
          .delete()
          .eq('email', email);

        if (error) {
          console.error('Unsubscribe error:', error);
          setStatus('Error unsubscribing. Please try again.');
        } else {
          setStatus('Successfully unsubscribed!');
          setExists(false);
          setEmail('');
        }
      } else {
        // Subscribe - insert record into Supabase
        const { error } = await supabase
          .from('newsletter')
          .insert([{ 
            email, 
            subscribed_at: new Date().toISOString() 
          }]);

        if (error) {
          console.error('Subscribe error:', error);
          // Handle duplicate email error
          if (error.code === '23505') {
            setStatus('This email is already subscribed.');
          } else {
            setStatus('Error subscribing. Please try again.');
          }
        } else {
          setStatus('Successfully subscribed!');
          setExists(true);
          setEmail('');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatus('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine button class dynamically
  const buttonClass = exists ? 'unsubscribe-btn' : '';

  // Determine status class dynamically
  const statusClass = status?.includes('Successfully') ? 'success' : 
                     status ? 'error' : '';

  return (
    <section className="newsletter-signup">
      <div className="newsletter-content">
        <h2>✉️ Stay in the Loop</h2>
        <p>Subscribe to our newsletter for the latest updates on events, workshops, and opportunities in the data science community.</p>
        
        <form onSubmit={handleToggleSubscription} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className={buttonClass} 
            disabled={loading || !email || checkingEmail}
          >
            {loading ? 'Processing...' : 
             checkingEmail ? 'Checking...' :
             exists ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </form>
        
        {status && (
          <p className={`newsletter-status ${statusClass}`}>
            {status}
          </p>
        )}
        
        <p className="newsletter-note">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSignup;