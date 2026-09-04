import React, { useState } from 'react';

export function NotificationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatus('');
    setError('');

    try {
      const response = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error sending suggestion');
      }

      setStatus('Your suggestion has been sent successfully.');

      setForm({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error(error);

      setError('Your suggestion could not be sent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="notification-form" onSubmit={handleSubmit}>
      <div className="notification-form__header">
        <span className="notification-form__icon">✉️</span>

        <div>
          <h2>Suggestions & feedback</h2>

          <p>
            Send us your questions, suggestions or feedback about the
            application.
          </p>
        </div>
      </div>

      <div className="notification-form__field">
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="notification-form__field">
        <label htmlFor="email">Contact email</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <span className="notification-form__help">
          We will only use this email if we need to reply to you.
        </span>
      </div>

      <div className="notification-form__field">
        <label htmlFor="message">Message</label>

        <textarea
          id="message"
          name="message"
          placeholder="Write your suggestion or question..."
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send suggestion'}
      </button>

      {status && (
        <div className="notification-form__success" role="status">
          ✓ {status}
        </div>
      )}

      {error && (
        <div className="notification-form__error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
