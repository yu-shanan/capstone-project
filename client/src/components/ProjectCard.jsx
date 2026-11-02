import { useState } from 'react';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#6366f1"/>
           <stop offset="55%" stop-color="#a855f7"/>
           <stop offset="100%" stop-color="#ec4899"/>
         </linearGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
       <text x="50%" y="50%" font-family="Segoe UI, Arial" font-size="26" font-weight="700"
             fill="#ffffff" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">Project preview</text>
     </svg>`
  );

const TONES = ['tone-1', 'tone-2', 'tone-3', 'tone-4'];

/** Reusable card for one portfolio project - receives its data through props */
export default function ProjectCard({ project, index = 0 }) {
  const [imageOk, setImageOk] = useState(Boolean(project.imageUrl));
  const src = imageOk && project.imageUrl ? project.imageUrl : FALLBACK_IMAGE;

  return (
    <article className={`card project-card ${TONES[index % TONES.length]}`}>
      <div className="card-media">
        <img
          src={src}
          alt={project.title}
          loading="lazy"
          onError={() => setImageOk(false)}
        />
      </div>

      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-text">{project.description}</p>

        <div className="card-actions">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="link">
              Repository ↗
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="link">
              Live demo ↗
            </a>
          )}
        </div>

        {project.user?.username && <div className="card-meta">by {project.user.username}</div>}
      </div>
    </article>
  );
}
