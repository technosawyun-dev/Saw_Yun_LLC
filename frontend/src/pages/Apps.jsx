import { useEffect, useState } from 'react';
import { listProjects } from '../api/projects';
import AppCard from '../components/AppCard';
import { NAVY, MUTED, BLUE, FONT_HEAD } from '../styles/theme';

export default function Apps() {
  const [apps, setApps] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listProjects('app').then(setApps).catch(() => setError('Could not load apps right now.'));
  }, []);

  return (
    <div data-screen-label="Apps" className="fade-up">
      <div className="page-header">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 12 }}>APPS</div>
        <h1 className="page-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, letterSpacing: -1, margin: '0 0 16px', color: NAVY }}>
          Our apps on Google Play
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: MUTED, maxWidth: 600, margin: 0 }}>
          Apps we publish ourselves. Each one has its own privacy policy, linked on its page and listed under <a href="/legal/apps" style={{ color: BLUE, fontWeight: 700, textDecoration: 'none' }}>Legal</a>.
        </p>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 90px' }}>
        {error && <div style={{ color: MUTED, fontSize: 14.5 }}>{error}</div>}
        {!error && !apps && <div style={{ color: MUTED, fontSize: 14.5 }}>Loading apps…</div>}
        {!error && apps && apps.length === 0 && <div style={{ color: MUTED, fontSize: 14.5 }}>No apps to show yet — check back soon.</div>}
        {!error && apps && apps.length > 0 && (
          <div className="apps-grid">
            {apps.map((p) => <AppCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
