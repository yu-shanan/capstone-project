import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Bounced here from a protected route? go back there, otherwise the dashboard
  const redirectTo = location.state?.from || '/admin';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', form);
      login({ token: data.token, _id: data._id, username: data.username, email: data.email });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-head">
            <span className="eyebrow">Members only</span>
            <h1>
              Welcome <span className="grad-text">back</span>
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Sign in to manage projects and blog posts.
            </p>
          </div>

          <form className="form auth-form" onSubmit={handleSubmit} noValidate>
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

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p className="error">{error}</p>}

            <div className="form-actions">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </div>
          </form>

          <p className="muted" style={{ textAlign: 'center', margin: '18px 0 0', fontSize: 14 }}>
            No account?{' '}
            <Link to="/register" className="link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
