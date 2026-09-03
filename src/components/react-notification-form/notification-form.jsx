import React, { useState } from 'react';

const styles = `
  .notification-form {
    max-width: 600px;
    padding: 2rem;

    border: 1px solid var(--color-grey-mid);
    border-radius: 4px;

    background: var(--color-white);

    font-family: 'Archivo', sans-serif;
  }

  .notification-form h2 {
    margin: 0 0 0.5rem;

    color: var(--color-core-blue);

    font-size: 1.75rem;
  }

  .notification-form p {
    margin: 0 0 2rem;

    color: var(--color-grey);

    line-height: 1.5;
  }

  .field {
    display: flex;
    flex-direction: column;

    gap: 0.5rem;

    margin-bottom: 1.25rem;
  }

  .field label {
    color: var(--color-blue-dark);

    font-size: 0.875rem;
    font-weight: 600;
  }

  .field input,
  .field textarea {
    width: 100%;

    padding: 0.75rem 1rem;

    border: 1px solid var(--color-grey-mid);
    border-radius: 2px;

    font-family: inherit;
    font-size: 1rem;

    color: var(--color-blue-dark);

    outline: none;
  }

  .field input:focus,
  .field textarea:focus {
    border-color: var(--color-blue);

    box-shadow: 0 0 0 1px var(--color-blue);
  }

  .field textarea {
    min-height: 130px;

    resize: vertical;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 0.75rem 1.5rem;

    border: 2px solid var(--color-core-blue);
    border-radius: 2px;

    background: var(--color-core-blue);
    color: var(--color-white);

    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;

    cursor: pointer;
  }

  button:hover:not(:disabled) {
    background: var(--color-navy);
    border-color: var(--color-navy);
  }

  button:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .success {
    margin-top: 1rem;

    color: #146c43;

    font-weight: 600;
  }

  .error {
    margin-top: 1rem;

    color: var(--color-red);

    font-weight: 600;
  }
`;

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

      if (!response.ok) {
        throw new Error(`Error sending notification: ${response.status}`);
      }

      setStatus('Notification sent successfully.');

      setForm({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error(error);

      setError('The notification could not be sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <form className="notification-form" onSubmit={handleSubmit}>
        <h2>Send notification</h2>

        <p>Send a notification from our Open Cells application.</p>

        <div className="field">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Your email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send notification'}
        </button>

        {status && <div className="success">{status}</div>}

        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}
