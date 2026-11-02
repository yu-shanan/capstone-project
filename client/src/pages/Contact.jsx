import { useState } from 'react';
import api from '../api/axios';
import { PROFILE } from '../config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', text: '✓ Thanks! Your message has been sent.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong, please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container page">
      <header style={{ marginBottom: 26 }}>
        <span className="eyebrow">Contact</span>
        <h1 style={{ margin: 0 }}>
          Let&apos;s make something <span className="grad-text">together</span>
        </h1>
      </header>

      <div className="contact-grid">
        <aside className="contact-panel">
          <h2>Say hello 👋</h2>
          <p>
            Have a question, an internship opening, or just want to talk about code? Drop me a
            message — I read everything.
          </p>

          <ul className="contact-list">
            <li>
              ✉️ <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </li>
            <li>📍 {PROFILE.location}</li>
            {PROFILE.github && (
              <li>
                🔗{' '}
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  github.com
                </a>
              </li>
            )}
            <li>🌸 {PROFILE.availability}</li>
          </ul>
        </aside>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ada Lovelace"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me a bit about what you have in mind…"
            required
          />

          {status.text && <p className={status.type}>{status.text}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" disabled={sending}>
              {sending ? 'Sending…' : 'Send message'}
            </button>
            <span className="form-note" style={{ alignSelf: 'center' }}>
              Stored securely in MongoDB.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
