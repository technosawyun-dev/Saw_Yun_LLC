import { useNavigate } from 'react-router-dom';
import { FONT_HEAD, FONT_BODY, NAVY } from '../styles/theme';

export default function CtaBand() {
  const navigate = useNavigate();
  return (
    <div className="cta-band">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(closest-side at 30% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(closest-side at 70% 70%, rgba(123,47,247,0.18), transparent 60%)',
      }} />
      <div style={{ position: 'relative' }}>
        <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 32, letterSpacing: -0.6, margin: '0 0 14px', color: '#fff' }}>
          Ready to build something reliable?
        </h2>
        <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.65)', maxWidth: 480, margin: '0 auto 28px' }}>
          Tell us about your project — we'll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => navigate('/contact')}
          style={{
            padding: '16px 34px', border: 'none', borderRadius: 12, background: '#fff', color: NAVY,
            fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15.5, cursor: 'pointer', position: 'relative',
          }}
        >Start a project →</button>
      </div>
    </div>
  );
}
