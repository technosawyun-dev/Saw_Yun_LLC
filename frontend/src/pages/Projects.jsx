import { useEffect, useState } from 'react';
import { listProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';
import { NAVY, MUTED, BLUE, FONT_HEAD } from '../styles/theme';

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listProjects().then(setProjects).catch(() => setError('Could not load projects right now.'));
  }, []);

  return (
    <div data-screen-label="Projects" className="fade-up">
      <div className="page-header">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 12 }}>PROJECTS</div>
        <h1 className="page-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, letterSpacing: -1, margin: '0 0 16px', color: NAVY }}>
          What we've shipped &amp; what's next
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: MUTED, maxWidth: 600, margin: 0 }}>
          We build all kinds of custom software for startups and enterprises — one flagship product live today, with more projects across other industries in active development.
        </p>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 90px' }}>
        {error && <div style={{ color: MUTED, fontSize: 14.5 }}>{error}</div>}
        {!error && !projects && <div style={{ color: MUTED, fontSize: 14.5 }}>Loading projects…</div>}
        {!error && projects && projects.length === 0 && <div style={{ color: MUTED, fontSize: 14.5 }}>No projects to show yet — check back soon.</div>}
        {!error && projects && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
