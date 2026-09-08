import React, { useState } from 'react';

const NOTIFICATION_URL =
  window.location.hostname === 'juan451.github.io'
    ? 'https://open-cells-task-manager-app.netlify.app/.netlify/functions/send-notification'
    : '/.netlify/functions/send-notification';

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
      console.log('Hostname:', window.location.hostname);
      console.log('Notification URL:', NOTIFICATION_URL);

      const response = await fetch(NOTIFICATION_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      console.log('Notification response:', {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok) {
        throw new Error(
          data.error || `Request failed with status ${response.status}`,
        );
      }

      setStatus('Your suggestion has been sent successfully.');

      setForm({
        name: '',
        email: '',
        message: '',
      });
    } catch (requestError) {
      console.error('Error sending suggestion:', requestError);

      setError(
        requestError.message ||
          'Your suggestion could not be sent. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="notification-form" onSubmit={handleSubmit}>
      <div className="notification-form__header">
        <div className="notification-form__icon">✉️</div>

        <div>
          <h2>Suggestions & feedback</h2>

          <p>
            Send us your questions, suggestions or feedback about the
            application.
          </p>
        </div>
      </div>

      <div className="notification-form__field">
        <label htmlFor="notification-name">Name</label>

        <input
          id="notification-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="notification-form__field">
        <label htmlFor="notification-email">Contact email</label>

        <input
          id="notification-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <span className="notification-form__help">
          We will only use this email if we need to reply to you.
        </span>
      </div>

      <div className="notification-form__field">
        <label htmlFor="notification-message">Message</label>

        <textarea
          id="notification-message"
          name="message"
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
          {status}
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
