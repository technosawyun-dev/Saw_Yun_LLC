import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProjects, deleteProject } from '../../api/projects';
import { NAVY, MUTED, BLUE, VIOLET, LINE, FONT_HEAD } from '../../styles/theme';

export default function AdminAppsList() {
  const [apps, setApps] = useState(null);
  const [error, setError] = useState(null);

  const load = () => listProjects('app').then(setApps).catch(() => setError('Could not load apps.'));

  useEffect(() => { load(); }, []);

  const onDelete = async (a) => {
    if (!window.confirm(`Delete "${a.title}"? This also removes its screenshot. This cannot be undone.`)) return;
    await deleteProject(a.id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY }}>Play Store Apps</h1>
        <Link to="/admin/apps/new" className="admin-btn admin-btn-primary" style={{ padding: '10px 18px', borderRadius: 10, background: NAVY, color: '#fff', fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>+ New app</Link>
      </div>

      {error && <div style={{ color: MUTED }}>{error}</div>}
      {!error && !apps && <div style={{ color: MUTED }}>Loading…</div>}
      {!error && apps && apps.length === 0 && <div style={{ color: MUTED }}>No apps yet. Add your first one.</div>}

      {!error && apps && apps.length > 0 && (
        <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden' }}>
          {apps.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '16px 20px', borderTop: i === 0 ? 'none' : `1px solid ${LINE}`,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{a.title}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{a.on_google_play ? 'Google Play link added' : 'No Google Play link yet'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  color: a.status === 'live' ? BLUE : VIOLET,
                  background: a.status === 'live' ? 'rgba(61,107,255,0.08)' : 'rgba(123,47,247,0.1)',
                  padding: '4px 10px', borderRadius: 100,
                }}>{a.status === 'live' ? 'LIVE' : 'COMING SOON'}</span>
                <Link to={`/admin/apps/${a.id}`} className="inline-link" style={{ fontSize: 13.5, color: BLUE }}>Edit</Link>
                <button onClick={() => onDelete(a)} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
