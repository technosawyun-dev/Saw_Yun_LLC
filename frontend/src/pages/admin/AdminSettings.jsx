import { useState } from 'react';
import { changePassword, logout } from '../../api/auth';
import PasswordInput from '../../components/admin/PasswordInput';
import { NAVY, MUTED, LINE, FONT_HEAD, FONT_BODY } from '../../styles/theme';

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 14, fontFamily: FONT_BODY, outline: 'none' };
const labelStyle = { display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 6 };

export default function AdminSettings() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (next !== confirm) {
      setStatus({ ok: false, msg: 'New passwords do not match.' });
      return;
    }
    if (next.length < 8) {
      setStatus({ ok: false, msg: 'New password must be at least 8 characters.' });
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      // Changing the password signs out every older session (including this one), so go to sign-in.
      setStatus({ ok: true, msg: 'Password updated. Please sign in again with your new password…' });
      setCurrent(''); setNext(''); setConfirm('');
      setTimeout(() => { logout(); window.location.href = '/admin/login'; }, 1800);
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.detail || 'Could not update password.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 24 }}>Settings</h1>
      <form onSubmit={onSubmit} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>Change password</div>
        <div>
          <label style={labelStyle}>Current password</label>
          <PasswordInput required style={inputStyle} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
        </div>
        <div>
          <label style={labelStyle}>New password</label>
          <PasswordInput required style={inputStyle} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
        </div>
        <div>
          <label style={labelStyle}>Confirm new password</label>
          <PasswordInput required style={inputStyle} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </div>
        {status && <div className="fade-up" style={{ fontSize: 13.5, color: status.ok ? '#1f8a4c' : '#c0392b' }}>{status.msg}</div>}
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{
          alignSelf: 'flex-start', padding: '11px 22px', border: 'none', borderRadius: 10, background: NAVY,
          color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1,
        }}>{saving ? 'Saving…' : 'Update password'}</button>
      </form>
    </div>
  );
}
