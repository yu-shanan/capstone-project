import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PROFILE } from '../config';
import BlogCard from '../components/BlogCard';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';
import SkillsMarquee from '../components/SkillsMarquee';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([api.get('/blog'), api.get('/projects')])
      .then(([blogRes, projectRes]) => {
        if (!active) return;
        setPosts(blogRes.data.slice(0, 3));
        setProjects(projectRes.data.slice(0, 3));
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Could not reach the API.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container page">
      {/* ---------- Hero ---------- */}
      <section className="hero" id="about">
        <div className="hero-copy">
          <span className="eyebrow">Hello, I&apos;m a developer</span>
          <h1>
            <span className="grad-text">{PROFILE.name}</span>
          </h1>
          <p className="hero-role">
            {PROFILE.role} <span className="dot">·</span> building things for the web
          </p>
          <p className="lead">{PROFILE.tagline}</p>

          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              Explore my work
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Let&apos;s talk
            </Link>
          </div>

          <ul className="meta-row">
            <li className="meta-chip">📍 {PROFILE.location}</li>
            <li className="meta-chip">
              ✉️ <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </li>
            {PROFILE.github && (
              <li className="meta-chip">
                🔗{' '}
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            )}
            <li className="meta-chip">🌸 {PROFILE.availability}</li>
          </ul>
        </div>

        <div className="hero-art">
          <div className="photo-ring">
            <img className="hero-photo" src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} />
          </div>
          <span className="float-chip c1">React</span>
          <span className="float-chip c2">Express</span>
          <span className="float-chip c3">MongoDB</span>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="stats" aria-label="At a glance">
        <div className="stat">
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat">
          <div className="stat-value">{posts.length}</div>
          <div className="stat-label">Articles</div>
        </div>
        <div className="stat">
          <div className="stat-value">{PROFILE.skills.length}</div>
          <div className="stat-label">Tech skills</div>
        </div>
        <div className="stat">
          <div className="stat-value">Open</div>
          <div className="stat-label">Availability</div>
        </div>
      </section>

      {error && <p className="error" style={{ marginTop: 20 }}>{error}</p>}

      {/* ---------- About ---------- */}
      <section className="section">
        <SectionTitle eyebrow="01 — About" title="A little about me" />

        <div className="about-grid">
          <div>
            {PROFILE.bio.map((paragraph, index) => (
              <p key={index} className="about-text">
                {paragraph}
              </p>
            ))}

            <ul className="highlight-list">
              {PROFILE.highlights.map((item, index) => (
                <li key={item} className="highlight-item">
                  <span className="highlight-dot">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="skill-list">
            {PROFILE.skills.map((skill) => (
              <li key={skill} className="skill">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <SkillsMarquee items={PROFILE.skills} />
      </section>

      {/* ---------- Projects ---------- */}
      <section className="section">
        <SectionTitle
          eyebrow="02 — Work"
          title="Selected projects"
          to="/projects"
          actionLabel="All projects →"
        />

        {loading && (
          <div className="grid">
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

        {!loading && !error && projects.length === 0 && (
          <EmptyState
            emoji="🚀"
            title="No projects yet"
            text="Log in and publish your first project from the admin dashboard."
            to="/admin"
            actionLabel="Go to admin"
          />
        )}

        <div className="grid">
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* ---------- Blog ---------- */}
      <section className="section">
        <SectionTitle
          eyebrow="03 — Writing"
          title="Latest from the blog"
          to="/blog"
          actionLabel="All articles →"
        />

        {loading && <p className="muted">Loading posts…</p>}

        {!loading && !error && posts.length === 0 && (
          <EmptyState
            emoji="📝"
            title="No articles yet"
            text="Write your first post and it will show up here."
            to="/admin"
            actionLabel="Write a post"
          />
        )}

        <div className="grid">
          {posts.map((post, index) => (
            <BlogCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta-band">
        <div>
          <h3>Have an idea worth building?</h3>
          <p>I&apos;m open to internships, collaborations and interesting side projects.</p>
        </div>
        <Link to="/contact" className="btn">
          Say hello 👋
        </Link>
      </section>
    </div>
  );
}
