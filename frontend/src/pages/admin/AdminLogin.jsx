import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login, isAuthed } from '../../api/auth';
import logo from '../../assets/logo.png';
import { NAVY, MUTED, LINE, BG, FONT_HEAD, FONT_BODY } from '../../styles/theme';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthed()) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, padding: 24 }}>
      <form onSubmit={onSubmit} style={{ width: '100%', maxWidth: 380, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <img src={logo} alt="Saw Yun" style={{ height: 32, width: 32, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, color: NAVY }}>Saw Yun Admin</div>
            <div style={{ fontSize: 12, color: MUTED }}>Sign in to manage the site</div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 8 }}>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourdomain.com"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 14.5, fontFamily: FONT_BODY, outline: 'none' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 8 }}>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 14.5, fontFamily: FONT_BODY, outline: 'none' }} />
        </div>
        {error && <div style={{ fontSize: 13.5, color: '#c0392b', marginBottom: 16 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{
          width: '100%', padding: '13px 0', border: 'none', borderRadius: 10,
          background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff',
          fontWeight: 700, fontSize: 14.5, fontFamily: FONT_BODY, cursor: submitting ? 'default' : 'pointer',
          opacity: submitting ? 0.7 : 1,
        }}>{submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
