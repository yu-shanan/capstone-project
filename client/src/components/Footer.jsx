import { Link } from 'react-router-dom';
import { PROFILE } from '../config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-logo" aria-hidden="true">
              &lt;/&gt;
            </span>
            <span className="grad-text">{PROFILE.name}</span>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/projects">Projects</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <a href={`mailto:${PROFILE.email}`}>Email</a>
            {PROFILE.github && (
              <a href={PROFILE.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
          </nav>
        </div>

        <div className="footer-chips">
          <span className="footer-chip">React 19</span>
          <span className="footer-chip">Express 5</span>
          <span className="footer-chip">MongoDB Atlas</span>
          <span className="footer-chip">JWT</span>
          <span className="footer-chip">Vite</span>
        </div>

        <p style={{ marginTop: 14 }}>
          © {year} {PROFILE.name} · Full-Stack Portfolio &amp; Blog
        </p>
      </div>
    </footer>
  );
}
