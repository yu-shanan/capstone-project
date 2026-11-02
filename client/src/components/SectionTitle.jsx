import { Link } from 'react-router-dom';

/** Section header: colourful eyebrow + title + optional action link */
export default function SectionTitle({ eyebrow, title, action, to, actionLabel }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
      </div>
      {actionLabel && to && (
        <Link to={to} className="section-link">
          {actionLabel}
        </Link>
      )}
      {action}
    </div>
  );
}
