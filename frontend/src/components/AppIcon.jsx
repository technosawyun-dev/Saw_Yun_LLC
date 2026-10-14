import { GRADIENT, FONT_HEAD } from '../styles/theme';
import { imageUrl } from '../api/client';

// Square app logo with Play-style rounded corners. Falls back to the first letter on the brand gradient.
export default function AppIcon({ src, name, size = 88 }) {
  const radius = Math.round(size * 0.22);
  const box = {
    width: size, height: size, borderRadius: radius, flexShrink: 0, overflow: 'hidden',
    boxShadow: '0 14px 28px -14px rgba(11,18,32,0.45), 0 0 0 1px rgba(11,18,32,0.08)',
  };
  if (src) {
    return <img src={imageUrl(src)} alt={`${name} logo`} width={size} height={size} style={{ ...box, objectFit: 'cover', display: 'block', background: '#fff' }} />;
  }
  return (
    <div aria-hidden="true" style={{ ...box, background: GRADIENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_HEAD, fontWeight: 700, fontSize: size * 0.45 }}>
      {(name || '?').trim().charAt(0).toUpperCase()}
    </div>
  );
}
