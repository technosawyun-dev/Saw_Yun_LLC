import { FONT_BODY } from '../styles/theme';

// Soft white "Get it on Google Play" badge. Drawn in SVG/CSS so it stays sharp at any size.
export default function GooglePlayButton({ href, size = 'md', stopClick = false }) {
  const big = size === 'lg';
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" className="gp-btn"
      aria-label="Get it on Google Play"
      onClick={stopClick ? (e) => e.stopPropagation() : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: big ? 14 : 11,
        padding: big ? '14px 34px 14px 26px' : '10px 24px 10px 18px', borderRadius: big ? 20 : 16,
        background: '#F7F7F8', color: '#111', textDecoration: 'none', fontFamily: FONT_BODY,
      }}
    >
      <svg width={big ? 30 : 24} height={big ? 33 : 26} viewBox="0 0 22 24" fill="none" aria-hidden="true">
        <path d="M1 1.2L13 12L1 22.8Z" fill="#00C8FF" />
        <path d="M1 1.2L17 9.6L13 12Z" fill="#2FDD7B" />
        <path d="M17 9.6L21 12L17 14.4L13 12Z" fill="#FFC800" />
        <path d="M1 22.8L13 12L17 14.4Z" fill="#FF3D57" />
      </svg>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
        <span style={{ fontSize: big ? 12.5 : 10.5, fontWeight: 600, letterSpacing: 0.4, color: '#6F7276' }}>GET IT ON</span>
        <span style={{ fontSize: big ? 24 : 18.5, fontWeight: 700, letterSpacing: -0.4 }}>Google Play</span>
      </span>
    </a>
  );
}
