import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProjects } from '../../api/projects';
import { listMessages } from '../../api/messages';
import { NAVY, MUTED, LINE, FONT_HEAD } from '../../styles/theme';

const cardStyle = { background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 22 };

export default function AdminDashboard() {
  const [projects, setProjects] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    listProjects().then(setProjects).catch(() => setProjects([]));
    listMessages().then(setMessages).catch(() => setMessages([]));
  }, []);

  const unread = messages ? messages.filter((m) => !m.is_read).length : null;

  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={cardStyle} className="hoverable-card">
          <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 6 }}>PROJECTS</div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 28, color: NAVY }}>{projects === null ? '…' : projects.length}</div>
        </div>
        <div style={cardStyle} className="hoverable-card">
          <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 6 }}>UNREAD MESSAGES</div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 28, color: NAVY }}>{unread === null ? '…' : unread}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/admin/projects/new" className="admin-btn admin-btn-primary" style={{ padding: '12px 20px', borderRadius: 10, background: NAVY, color: '#fff', fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>+ New project</Link>
        <Link to="/admin/messages" className="admin-btn" style={{ padding: '12px 20px', borderRadius: 10, border: `1px solid ${LINE}`, background: '#fff', color: NAVY, fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>View messages</Link>
      </div>
    </div>
  );
}
