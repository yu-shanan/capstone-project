import { Link } from 'react-router-dom';

/** Friendly empty state with an optional call-to-action */
export default function EmptyState({ emoji = '✨', title, text, to, actionLabel }) {
  return (
    <div className="empty">
      <div className="empty-emoji" aria-hidden="true">
        {emoji}
      </div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {to && actionLabel && (
        <Link to={to} className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
