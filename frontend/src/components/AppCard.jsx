import { useNavigate } from 'react-router-dom';
import { NAVY, MUTED, LINE, FONT_HEAD } from '../styles/theme';
import AppIcon from './AppIcon';
import GooglePlayButton from './GooglePlayButton';

export default function AppCard({ project }) {
  const navigate = useNavigate();
  const live = project.status === 'live';
  const go = () => navigate(`/apps/${project.slug}`);
  return (
    <div
      className="app-card" role="link" tabIndex={0} onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
      style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 20, cursor: 'pointer' }}
    >
      <AppIcon src={project.cover_image_url} name={project.title} size={96} />
      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 21, letterSpacing: -0.3, color: NAVY, margin: '20px 0 8px' }}>{project.title}</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.6, color: MUTED, marginBottom: 22, flex: 1 }}>{project.tagline}</div>
      {live && project.on_google_play ? (
        <GooglePlayButton href={project.download_android_url} stopClick />
      ) : (
        <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, color: '#7B2FF7', background: 'rgba(123,47,247,0.1)', padding: '8px 14px', borderRadius: 100 }}>COMING SOON</span>
      )}
    </div>
  );
}
