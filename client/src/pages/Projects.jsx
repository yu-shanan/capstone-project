import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <header className="section-head" style={{ marginBottom: 8 }}>
        <div>
          <span className="eyebrow">Portfolio</span>
          <h1 style={{ margin: 0 }}>
            Things I&apos;ve <span className="grad-text">built</span>
          </h1>
          <p className="lead" style={{ marginTop: 10 }}>
            Course work, side projects and experiments — each one taught me something new.
          </p>
        </div>
        {!loading && !error && (
          <span className="badge">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </span>
        )}
      </header>

      {loading && (
        <div className="grid" style={{ marginTop: 28 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="card" style={{ height: 300 }}>
              <div className="card-body" style={{ gap: 14 }}>
                <div className="skeleton" style={{ width: '70%', height: 20 }} />
                <div className="skeleton" />
                <div className="skeleton" style={{ width: '85%' }} />
                <div className="skeleton" style={{ width: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div style={{ marginTop: 28 }}>
          <EmptyState
            emoji="🛠️"
            title="Nothing published yet"
            text="Add your first project from the admin dashboard and it will appear here instantly."
            to="/admin"
            actionLabel="Open admin dashboard"
          />
        </div>
      )}

      <div className="grid" style={{ marginTop: 28 }}>
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
