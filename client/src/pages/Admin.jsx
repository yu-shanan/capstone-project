import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyProject = {
  title: '',
  description: '',
  imageUrl: '',
  repoUrl: '',
  liveUrl: '',
};

const emptyPost = { title: '', content: '' };

export default function Admin() {
  const { user } = useAuth();

  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [postForm, setPostForm] = useState(emptyPost);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [p, b] = await Promise.all([api.get('/projects'), api.get('/blog')]);
      setProjects(p.data);
      setPosts(b.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetMessages = () => {
    setMessage('');
    setError('');
  };

  const saveProject = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      if (projectForm._id) {
        await api.put(`/projects/${projectForm._id}`, projectForm);
        setMessage('Project updated');
      } else {
        await api.post('/projects', projectForm);
        setMessage('Project created');
      }
      setProjectForm(emptyProject);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    resetMessages();
    try {
      await api.delete(`/projects/${id}`);
      setMessage('Project deleted');
      if (projectForm._id === id) setProjectForm(emptyProject);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const savePost = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      if (postForm._id) {
        await api.put(`/blog/${postForm._id}`, postForm);
        setMessage('Post updated');
      } else {
        await api.post('/blog', postForm);
        setMessage('Post created');
      }
      setPostForm(emptyPost);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    resetMessages();
    try {
      await api.delete(`/blog/${id}`);
      setMessage('Post deleted');
      if (postForm._id === id) setPostForm(emptyPost);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ width: 240, height: 30, marginBottom: 20 }} />
        <div className="admin-grid">
          <div className="card-panel" style={{ height: 260 }} />
          <div className="card-panel" style={{ height: 260 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="section-head" style={{ marginBottom: 6 }}>
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 style={{ margin: 0 }}>
            Content <span className="grad-text">studio</span>
          </h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            Signed in as <strong>{user?.username}</strong> · every change is saved straight to MongoDB.
          </p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-icon" aria-hidden="true">
            🧩
          </span>
          <div>
            <div className="admin-stat-value">{projects.length}</div>
            <div className="admin-stat-label">Projects</div>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon" aria-hidden="true">
            📝
          </span>
          <div>
            <div className="admin-stat-value">{posts.length}</div>
            <div className="admin-stat-label">Blog posts</div>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon" aria-hidden="true">
            👤
          </span>
          <div>
            <div className="admin-stat-value" style={{ fontSize: 17 }}>
              {user?.username}
            </div>
            <div className="admin-stat-label">Signed in as</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === 'projects' ? 'tab active' : 'tab'}
          onClick={() => {
            setTab('projects');
            resetMessages();
          }}
        >
          Projects
        </button>
        <button
          className={tab === 'posts' ? 'tab active' : 'tab'}
          onClick={() => {
            setTab('posts');
            resetMessages();
          }}
        >
          Blog posts
        </button>      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {tab === 'projects' && (
        <div className="admin-grid">
          <form className="form card-panel" onSubmit={saveProject}>
            <h2>{projectForm._id ? '✏️ Edit project' : '➕ New project'}</h2>

            <label htmlFor="ptitle">Title</label>
            <input
              id="ptitle"
              value={projectForm.title}
              placeholder="Capstone Portfolio & Blog"
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              required
            />

            <label htmlFor="pdesc">Description</label>
            <textarea
              id="pdesc"
              rows="3"
              value={projectForm.description}
              placeholder="What it does, what you used, what you learned…"
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              required
            />

            <label htmlFor="pimage">Image URL (optional)</label>
            <input
              id="pimage"
              value={projectForm.imageUrl}
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
            />

            <label htmlFor="prepo">Repo URL (optional)</label>
            <input
              id="prepo"
              value={projectForm.repoUrl}
              placeholder="https://github.com/you/project"
              onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
            />

            <label htmlFor="plive">Live URL (optional)</label>
            <input
              id="plive"
              value={projectForm.liveUrl}
              placeholder="https://your-project.vercel.app"
              onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
            />

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {projectForm._id ? 'Update project' : 'Create project'}
              </button>
              {projectForm._id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setProjectForm(emptyProject)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="card-panel">
            <h2>🧩 Existing projects ({projects.length})</h2>
            <ul className="admin-list">
              {projects.map((p) => (
                <li key={p._id}>
                  <span className="title">{p.title}</span>
                  <span className="admin-actions">
                    <button
                      className="btn btn-soft btn-sm"
                      onClick={() => setProjectForm({ ...emptyProject, ...p })}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p._id)}>
                      Delete
                    </button>
                  </span>
                </li>
              ))}
              {projects.length === 0 && <li className="muted">No projects yet — create one on the left.</li>}
            </ul>
          </div>
        </div>
      )}

      {tab === 'posts' && (
        <div className="admin-grid">
          <form className="form card-panel" onSubmit={savePost}>
            <h2>{postForm._id ? '✏️ Edit post' : '➕ New post'}</h2>

            <label htmlFor="btitle">Title</label>
            <input
              id="btitle"
              value={postForm.title}
              placeholder="How I built this portfolio"
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              required
            />

            <label htmlFor="bcontent">Content</label>
            <textarea
              id="bcontent"
              rows="9"
              value={postForm.content}
              placeholder="Write your article here. Line breaks are preserved."
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              required
            />

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {postForm._id ? 'Update post' : 'Publish post'}
              </button>
              {postForm._id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setPostForm(emptyPost)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="card-panel">
            <h2>📝 Existing posts ({posts.length})</h2>
            <ul className="admin-list">
              {posts.map((p) => (
                <li key={p._id}>
                  <span className="title">{p.title}</span>
                  <span className="admin-actions">
                    <button
                      className="btn btn-soft btn-sm"
                      onClick={() => setPostForm({ ...emptyPost, ...p })}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletePost(p._id)}>
                      Delete
                    </button>
                  </span>
                </li>
              ))}
              {posts.length === 0 && <li className="muted">No posts yet — write your first one.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
