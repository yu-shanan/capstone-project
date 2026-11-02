import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PROFILE } from '../config';
import Footer from './Footer';

const navClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

/** Scroll back to the top whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Floating "back to top" button, appears after the first screen */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`to-top ${visible ? 'show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑
    </button>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-logo" aria-hidden="true">
              &lt;/&gt;
            </span>
            <span className="brand-text">{PROFILE.name}</span>
          </NavLink>

          <nav className="nav" aria-label="Main navigation">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            <NavLink to="/projects" className={navClass}>
              Projects
            </NavLink>
            <NavLink to="/blog" className={navClass}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>

            {user ? (
              <>
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm nav-register">
                  Register
                </NavLink>
              </>
            )}
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main" id="main">
        <ScrollToTop />
        <Outlet />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
