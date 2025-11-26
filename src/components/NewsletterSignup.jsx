import React, { useState } from 'react';
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

const handleSubmit = async (e) => {
e.preventDefault();

if (!email) {
  setStatus('Please enter a valid email.');
  return;
}

setLoading(true);
setStatus(null);

try {
  const { data, error } = await supabase
    .from('newsletter')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') {
      setStatus('This email is already subscribed.');
    } else {
      console.error('Supabase error:', error);
      setStatus('Error subscribing. Please try again.');
    }
  } else {
    setStatus('Thank you for subscribing!');
    setEmail('');
    console.log('Inserted data:', data);
  }
} catch (err) {
  console.error('Unexpected error:', err);
  setStatus('Error subscribing. Please try again.');
} finally {
  setLoading(false);
}

};

return ( <section className="newsletter-signup"> <div className="newsletter-content"> <h2>✉️ Stay in the Loop</h2> <p>Subscribe to our newsletter for the latest updates on events, workshops, and opportunities in the data science community.</p> <form onSubmit={handleSubmit} className="newsletter-form">
<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
disabled={loading}
/> <button type="submit" disabled={loading}>
{loading ? 'Submitting...' : 'Subscribe'} </button> </form>
{status && <p className="newsletter-status">{status}</p>} <p className="newsletter-note">We respect your privacy. Unsubscribe at any time.</p> </div> </section>
);
}

export default NewsletterSignup;
