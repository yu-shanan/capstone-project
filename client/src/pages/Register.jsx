import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/users/register', form);
      // auto-login after registering
      const { data } = await api.post('/users/login', {
        email: form.email,
        password: form.password,
      });
      login({ token: data.token, _id: data._id, username: data.username, email: data.email });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-head">
            <span className="eyebrow">Create account</span>
            <h1>
              Join the <span className="grad-text">dashboard</span>
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Register to publish projects and write blog posts.
            </p>
          </div>

          <form className="form auth-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="e.g. shanna"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password (min 6 characters)</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              placeholder="••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p className="error">{error}</p>}

            <div className="form-actions">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating account…' : 'Register'}
              </button>
            </div>
          </form>

          <p className="muted" style={{ textAlign: 'center', margin: '18px 0 0', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
