import { FONT_BODY } from '../styles/theme';

export default function GooglePlayButton({ href, size = 'md', stopClick = false }) {
  const big = size === 'lg';
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" className="gp-btn"
      aria-label="Get it on Google Play"
      onClick={stopClick ? (e) => e.stopPropagation() : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: big ? 12 : 10,
        padding: big ? '11px 24px 11px 18px' : '8px 18px 8px 14px', borderRadius: big ? 12 : 10,
        background: '#fff', color: '#0B1220', textDecoration: 'none', fontFamily: FONT_BODY,
        border: '1px solid rgba(11,18,32,0.22)',
      }}
    >
      <svg width={big ? 26 : 20} height={big ? 28 : 22} viewBox="0 0 22 24" fill="none" aria-hidden="true">
        <path d="M1 1.2L12 12L1 22.8Z" fill="#22D3EE" />
        <path d="M1 1.2L16 9.4L12 12Z" fill="#7B2FF7" />
        <path d="M1 22.8L16 14.6L12 12Z" fill="#3D6BFF" />
        <path d="M16 9.4L21 12L16 14.6L12 12Z" fill="#FACC15" />
      </svg>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, textAlign: 'left' }}>
        <span style={{ fontSize: big ? 10.5 : 9.5, fontWeight: 600, letterSpacing: 0.7, opacity: 0.8 }}>GET IT ON</span>
        <span style={{ fontSize: big ? 19 : 15.5, fontWeight: 700 }}>Google Play</span>
      </span>
    </a>
  );
}
