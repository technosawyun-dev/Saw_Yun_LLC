import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProjects, deleteProject } from '../../api/projects';
import { NAVY, MUTED, BLUE, VIOLET, LINE, FONT_HEAD } from '../../styles/theme';

export default function AdminProjectsList() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(null);

  const load = () => listProjects().then(setProjects).catch(() => setError('Could not load projects.'));

  useEffect(() => { load(); }, []);

  const onDelete = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This also removes its screenshots. This cannot be undone.`)) return;
    await deleteProject(p.id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY }}>Projects</h1>
        <Link to="/admin/projects/new" className="admin-btn admin-btn-primary" style={{ padding: '10px 18px', borderRadius: 10, background: NAVY, color: '#fff', fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>+ New project</Link>
      </div>

      {error && <div style={{ color: MUTED }}>{error}</div>}
      {!error && !projects && <div style={{ color: MUTED }}>Loading…</div>}
      {!error && projects && projects.length === 0 && <div style={{ color: MUTED }}>No projects yet. Create your first one.</div>}

      {!error && projects && projects.length > 0 && (
        <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden' }}>
          {projects.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '16px 20px', borderTop: i === 0 ? 'none' : `1px solid ${LINE}`,
              transition: 'background .18s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,18,32,0.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{p.title}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>/{p.slug}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
                  color: p.status === 'live' ? BLUE : VIOLET,
                  background: p.status === 'live' ? 'rgba(61,107,255,0.08)' : 'rgba(123,47,247,0.1)',
                }}>{p.status === 'live' ? 'LIVE' : 'IN DEV'}</span>
                <Link to={`/admin/projects/${p.id}`} className="inline-link" style={{ fontSize: 13.5, color: BLUE }}>Edit</Link>
                <button onClick={() => onDelete(p)} className="admin-btn" style={{ background: 'none', border: 'none', color: '#c0392b', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
