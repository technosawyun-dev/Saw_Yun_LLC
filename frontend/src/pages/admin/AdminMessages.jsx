import { useEffect, useState } from 'react';
import { listMessages, markMessageRead, deleteMessage } from '../../api/messages';
import { NAVY, MUTED, BLUE, LINE, FONT_HEAD } from '../../styles/theme';

export default function AdminMessages() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);

  const load = () => listMessages().then(setMessages).catch(() => setError('Could not load messages.'));

  useEffect(() => { load(); }, []);

  const onMarkRead = async (m) => {
    await markMessageRead(m.id);
    setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, is_read: true } : x)));
  };

  const onDelete = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    await deleteMessage(m.id);
    setMessages((ms) => ms.filter((x) => x.id !== m.id));
  };

  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 24 }}>Messages</h1>
      {error && <div style={{ color: MUTED }}>{error}</div>}
      {!error && !messages && <div style={{ color: MUTED }}>Loading…</div>}
      {!error && messages && messages.length === 0 && <div style={{ color: MUTED }}>No messages yet.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages && messages.map((m) => (
          <div key={m.id} className="hoverable-lift" style={{
            background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 20,
            borderLeft: m.is_read ? `1px solid ${LINE}` : `3px solid ${BLUE}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontWeight: 700, color: NAVY }}>{m.name}</span>
                <span style={{ color: MUTED, fontSize: 13, marginLeft: 8 }}>{m.email}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div style={{ fontSize: 14, color: NAVY, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 12 }}>{m.message}</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {!m.is_read && <button onClick={() => onMarkRead(m)} className="inline-link" style={{ background: 'none', border: 'none', color: BLUE, fontSize: 13, padding: 0 }}>Mark read</button>}
              <button onClick={() => onDelete(m)} className="inline-link" style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: 13, padding: 0 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
