import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import ReadingProgress from '../components/ReadingProgress';

const TONES = ['tone-1', 'tone-2', 'tone-3', 'tone-4'];

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPost = () => {
    setLoading(true);
    api
      .get(`/blog/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load post'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    setCommentError('');
    setSubmitting(true);
    try {
      await api.post(`/blog/${id}/comments`, { body: comment });
      setComment('');
      loadPost();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container page page-narrow">
        <div className="skeleton" style={{ width: '40%', marginBottom: 18 }} />
        <div className="skeleton" style={{ height: 34, marginBottom: 14 }} />
        <div className="skeleton" style={{ width: '60%', marginBottom: 30 }} />
        <div className="skeleton" style={{ marginBottom: 10 }} />
        <div className="skeleton" style={{ marginBottom: 10 }} />
        <div className="skeleton" style={{ width: '80%' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page page-narrow">
        <p className="error">{error}</p>
        <Link to="/blog" className="post-back" style={{ marginTop: 16 }}>
          ← Back to blog
        </Link>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container page page-narrow">
      <ReadingProgress />

      <Link to="/blog" className="post-back">
        ← Back to blog
      </Link>

      <header className="post-hero" style={{ marginTop: 18 }}>
        <span className="eyebrow">Article</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <Avatar name={post.author?.username || 'anonymous'} size="lg" />
          <span>{post.author?.username || 'anonymous'}</span>
          <span aria-hidden="true">·</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{Math.max(1, Math.round(post.content.split(/\s+/).length / 200))} min read</span>
        </div>
      </header>

      <article className="post-body">{post.content}</article>

      <section className="comments">
        <h2>
          Comments <span className="grad-text">({post.comments?.length || 0})</span>
        </h2>

        {post.comments?.length === 0 && (
          <p className="muted">No comments yet — be the first to say something 👇</p>
        )}

        <ul className="comment-list">
          {post.comments?.map((c, index) => (
            <li key={c._id} className={`comment ${TONES[index % TONES.length]}`}>
              <div className="comment-head">
                <Avatar name={c.author?.username || 'anonymous'} />
                <span>{c.author?.username || 'anonymous'}</span>
                <span aria-hidden="true">·</span>
                <span style={{ fontWeight: 500 }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-body">{c.body}</p>
            </li>
          ))}
        </ul>

        {user ? (
          <form className="form" onSubmit={handleComment}>
            <label htmlFor="comment">Leave a comment</label>
            <textarea
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts…"
              required
            />
            {commentError && <p className="error">{commentError}</p>}
            <div className="form-actions">
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="empty" style={{ padding: '26px 20px' }}>
            <div className="empty-emoji" aria-hidden="true">
              💬
            </div>
            <h3>Join the discussion</h3>
            <p>
              <Link to="/login" className="link">
                Log in
              </Link>{' '}
              to leave a comment.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
