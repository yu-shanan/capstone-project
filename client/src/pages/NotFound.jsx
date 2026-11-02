import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="notfound">
        <div className="notfound-code">404</div>
        <h1 style={{ marginTop: 8 }}>
          This page went <span className="grad-text">offline</span>
        </h1>
        <p className="lead" style={{ margin: '0 auto 26px' }}>
          The link may be broken, or the page may have been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            Back home
          </Link>
          <Link to="/projects" className="btn btn-ghost">
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
