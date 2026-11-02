import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const TONES = ['tone-2', 'tone-3', 'tone-1', 'tone-4'];

const readingTime = (text = '') => Math.max(1, Math.round(text.split(/\s+/).length / 200));

export default function BlogCard({ post, index = 0 }) {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const excerpt = post.content.length > 130 ? `${post.content.slice(0, 130).trim()}…` : post.content;

  return (
    <article className={`card blog-card ${TONES[index % TONES.length]}`}>
      <div className="cover">
        <span className="cover-badge">Article</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/blog/${post._id}`}>{post.title}</Link>
        </h3>
        <p className="card-text">{excerpt}</p>

        <div className="card-meta">
          <Avatar name={post.author?.username || 'anonymous'} />
          <span>{post.author?.username || 'anonymous'}</span>
          <span aria-hidden="true">·</span>
          <span>{date}</span>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.content)} min read</span>
        </div>

        <div className="card-actions">
          <Link to={`/blog/${post._id}`} className="link">
            Read article →
          </Link>
        </div>
      </div>
    </article>
  );
}
