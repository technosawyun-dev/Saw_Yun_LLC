import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAVY, MUTED, BLUE, VIOLET, LINE, BG, FONT_HEAD, liveDemoButtonStyle } from '../styles/theme';
import { imageUrl } from '../api/client';

const cardStyle = {
  background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, overflow: 'hidden',
  cursor: 'pointer', transition: 'transform .25s ease, box-shadow .25s ease',
};
const cardHoverStyle = { transform: 'translateY(-6px)', boxShadow: '0 24px 44px -24px rgba(11,18,32,0.22)' };
const thumbStyle = {
  height: 190, overflow: 'hidden', position: 'relative', background: BG,
  borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const devThumbStyle = {
  ...thumbStyle,
  background: 'repeating-linear-gradient(135deg, rgba(123,47,247,0.06) 0px, rgba(123,47,247,0.06) 12px, rgba(61,107,255,0.04) 12px, rgba(61,107,255,0.04) 24px)',
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const isLiveDemo = project.status === 'live_demo';
  const isShipped = project.status === 'live' || isLiveDemo;

  return (
    <div
      style={hover ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/projects/${project.slug}`)}
    >
      <div style={isShipped ? thumbStyle : devThumbStyle}>
        {isShipped && project.cover_image_url ? (
          <img src={imageUrl(project.cover_image_url)} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : isShipped ? (
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)',
          }} />
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M12 7V12L15.5 14" stroke={VIOLET} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke={VIOLET} strokeWidth="2" />
          </svg>
        )}
      </div>
      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, color: NAVY }}>{project.title}</div>
          {isShipped ? (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
              color: isLiveDemo ? '#0891b2' : BLUE,
              background: isLiveDemo ? 'rgba(8,145,178,0.1)' : 'rgba(61,107,255,0.08)',
              padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isLiveDemo ? '#0891b2' : BLUE }} />
              {isLiveDemo ? 'LIVE DEMO' : 'LIVE'}
            </span>
          ) : (
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: VIOLET,
              background: 'rgba(123,47,247,0.1)', padding: '5px 10px', borderRadius: 100,
            }}>IN DEV</span>
          )}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: MUTED, marginBottom: 18 }}>{project.tagline}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: NAVY }}>View details →</span>
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={liveDemoButtonStyle}
            >
              {isLiveDemo ? 'Live Demo' : 'Open App'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 2 }}>
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
