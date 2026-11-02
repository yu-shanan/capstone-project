import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BlogCard from '../components/BlogCard';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/blog')
      .then((res) => setPosts(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = posts;

  return (
    <div className="container page">
      <header className="section-head" style={{ marginBottom: 8 }}>
        <div>
          <span className="eyebrow">Writing</span>
          <h1 style={{ margin: 0 }}>
            Notes from the <span className="grad-text">build log</span>
          </h1>
          <p className="lead" style={{ marginTop: 10 }}>
            What I learned while building this project — APIs, React patterns and the bugs in between.
          </p>
        </div>
        {!loading && !error && <span className="badge">{posts.length} articles</span>}
      </header>

      {loading && (
        <div className="grid" style={{ marginTop: 26 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="card" style={{ height: 280 }}>
              <div className="skeleton" style={{ height: 96, borderRadius: 0 }} />
              <div className="card-body" style={{ gap: 12 }}>
                <div className="skeleton" style={{ width: '80%', height: 20 }} />
                <div className="skeleton" />
                <div className="skeleton" style={{ width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div style={{ marginTop: 26 }}>
          <EmptyState
            emoji="✍️"
            title="The blog is empty"
            text="Publish your first article in the admin dashboard — it can be long or short, just start."
            to="/admin"
            actionLabel="Write a post"
          />
        </div>
      )}

      {featured && (
        <article className="card tone-1" style={{ marginTop: 26 }}>
          <div className="cover" style={{ height: 128 }}>
            <span className="cover-badge">★ Featured</span>
          </div>
          <div className="card-body" style={{ padding: '24px 26px 26px' }}>
            <h2 className="card-title" style={{ fontSize: 'clamp(21px, 2.6vw, 28px)' }}>
              <Link to={`/blog/${featured._id}`}>{featured.title}</Link>
            </h2>
            <p className="card-text">
              {featured.content.length > 220
                ? `${featured.content.slice(0, 220).trim()}…`
                : featured.content}
            </p>
            <div className="card-meta">
              <Avatar name={featured.author?.username || 'anonymous'} />
              <span>{featured.author?.username || 'anonymous'}</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(featured.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="card-actions">
              <Link to={`/blog/${featured._id}`} className="link">
                Read the full article →
              </Link>
            </div>
          </div>
        </article>
      )}

      <div className="grid" style={{ marginTop: 22 }}>
        {rest.map((post, index) => (
          <BlogCard key={post._id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
