import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../api/projects';
import { imageUrl } from '../api/client';
import IOSFrame from '../components/devices/IOSFrame';
import AndroidFrame from '../components/devices/AndroidFrame';
import MacWindowFrame from '../components/devices/MacWindowFrame';
import BrowserWindowFrame from '../components/devices/BrowserWindowFrame';
import { POSMobileMockRich, POSDesktopMockRich } from '../components/PosMocks';
import {
  NAVY, MUTED, BLUE, VIOLET, LINE, FONT_HEAD, FONT_BODY,
  PLATFORMS, PLATFORM_NOTES, liveDemoButtonStyle,
} from '../styles/theme';

function tabStyle(active) {
  return {
    padding: '10px 20px', borderRadius: 10, border: active ? 'none' : `1px solid ${LINE}`,
    background: active ? 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)' : '#fff',
    color: active ? '#fff' : NAVY, fontWeight: 700, fontSize: 14, cursor: 'pointer',
    fontFamily: FONT_BODY, transition: 'all .2s ease',
  };
}

const FALLBACK_MOCK = {
  ios: <POSMobileMockRich />, android: <POSMobileMockRich />,
  web: <POSDesktopMockRich />, windows: <POSDesktopMockRich />,
};

const DOWNLOAD_FIELD = { ios: 'download_ios_url', android: 'download_android_url', windows: 'download_windows_url' };

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [platform, setPlatform] = useState('ios');

  useEffect(() => {
    setProject(null);
    setNotFound(false);
    getProject(slug)
      .then((p) => {
        setProject(p);
        const firstAvailable = PLATFORMS.find((pl) => p.screenshots.some((s) => s.platform === pl.key));
        setPlatform(firstAvailable ? firstAvailable.key : 'ios');
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="detail-top-dev">
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 12 }}>Project not found</div>
        <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 700, color: BLUE, cursor: 'pointer' }}>← All projects</button>
      </div>
    );
  }

  if (!project) {
    return <div className="detail-top-dev" style={{ color: MUTED }}>Loading…</div>;
  }

  const isLiveDemo = project.status === 'live_demo';
  const isShipped = project.status === 'live' || isLiveDemo;
  const screenshot = project.screenshots.find((s) => s.platform === platform);
  const notes = PLATFORM_NOTES[platform];
  const downloadUrl = DOWNLOAD_FIELD[platform] ? project[DOWNLOAD_FIELD[platform]] : null;

  return (
    <div data-screen-label="Project detail" className="fade-up">
      {isShipped ? (
        <div className="detail-top-live">
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 700, color: BLUE, cursor: 'pointer', fontFamily: FONT_BODY, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← All projects</button>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 8, marginTop: 24 }}>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 26, letterSpacing: -0.5, margin: 0, color: NAVY }}>{project.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: isLiveDemo ? '#0891b2' : BLUE,
                background: isLiveDemo ? 'rgba(8,145,178,0.1)' : 'rgba(61,107,255,0.08)',
                padding: '5px 12px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isLiveDemo ? '#0891b2' : BLUE, animation: 'pulseGlow 2s ease-in-out infinite' }} />
                {isLiveDemo ? 'LIVE DEMO' : 'LIVE'}
              </span>
              {project.live_demo_url && (
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" style={liveDemoButtonStyle}>
                  {isLiveDemo ? 'Live Demo' : 'Open App'}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 2 }}><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              )}
            </div>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: MUTED, maxWidth: 720, margin: '10px 0 32px' }}>{project.description}</p>

          <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
            {PLATFORMS.map((p) => (
              <button key={p.key} onClick={() => setPlatform(p.key)} style={tabStyle(platform === p.key)}>{p.label}</button>
            ))}
          </div>

          <div className="case-study-grid">
            <div className="case-study-device-wrap">
              <div className="fade-up" key={platform}>
                {platform === 'ios' && <IOSFrame screenshot={screenshot ? imageUrl(screenshot.image_url) : null} focalX={screenshot?.focal_x ?? 50} focalY={screenshot?.focal_y ?? 50} zoom={screenshot?.zoom ?? 1} alt={`${project.title} on iOS`}>{FALLBACK_MOCK.ios}</IOSFrame>}
                {platform === 'android' && <AndroidFrame screenshot={screenshot ? imageUrl(screenshot.image_url) : null} focalX={screenshot?.focal_x ?? 50} focalY={screenshot?.focal_y ?? 50} zoom={screenshot?.zoom ?? 1} alt={`${project.title} on Android`}>{FALLBACK_MOCK.android}</AndroidFrame>}
                {platform === 'web' && <BrowserWindowFrame screenshot={screenshot ? imageUrl(screenshot.image_url) : null} focalX={screenshot?.focal_x ?? 50} focalY={screenshot?.focal_y ?? 50} zoom={screenshot?.zoom ?? 1} alt={`${project.title} on Web`} url="app.sawyunpos.com">{FALLBACK_MOCK.web}</BrowserWindowFrame>}
                {platform === 'windows' && <MacWindowFrame screenshot={screenshot ? imageUrl(screenshot.image_url) : null} focalX={screenshot?.focal_x ?? 50} focalY={screenshot?.focal_y ?? 50} zoom={screenshot?.zoom ?? 1} alt={`${project.title} on Windows`} title={project.title}>{FALLBACK_MOCK.windows}</MacWindowFrame>}
              </div>
            </div>
            <div style={{ paddingTop: 20 }}>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, color: NAVY, marginBottom: 14 }}>Built for {notes.title}</div>
              {notes.notes.map((n) => (
                <div key={n} style={{ fontSize: 14.5, lineHeight: 1.6, color: MUTED, paddingLeft: 20, position: 'relative', marginBottom: 14 }}>{n}</div>
              ))}
              {downloadUrl && (
                <a
                  href={downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="admin-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '11px 20px',
                    borderRadius: 10, border: `1px solid ${LINE}`, background: '#fff', color: NAVY,
                    fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY, textDecoration: 'none',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 18V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  Download for {notes.title}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="detail-top-dev">
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 700, color: BLUE, cursor: 'pointer', fontFamily: FONT_BODY, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← All projects</button>
          <div style={{ marginTop: 24 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: VIOLET, background: 'rgba(123,47,247,0.1)', padding: '5px 10px', borderRadius: 100 }}>IN DEVELOPMENT</span>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, margin: '14px 0 16px', color: NAVY }}>{project.title}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: MUTED, maxWidth: 640, margin: '0 0 28px' }}>{project.description || project.tagline}</p>
            <button
              onClick={() => navigate('/contact')}
              style={{ padding: '14px 24px', border: 'none', borderRadius: 11, background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
            >Get in touch →</button>
          </div>
        </div>
      )}
    </div>
  );
}
