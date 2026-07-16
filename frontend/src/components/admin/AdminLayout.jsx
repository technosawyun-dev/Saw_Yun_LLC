import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { logout } from '../../api/auth';
import { NAVY, BG, FONT_HEAD } from '../../styles/theme';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const linkStyle = ({ isActive }) => ({
    display: 'block', padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
    color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
    textDecoration: 'none', marginBottom: 4, transition: 'background .18s ease, color .18s ease',
  });

  return (
    <div className="admin-shell-grid">
      <div style={{ background: NAVY, padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px', marginBottom: 32 }}>
          <img src={logo} alt="Saw Yun" style={{ height: 26, width: 26, objectFit: 'contain' }} />
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: '#fff' }}>SAW YUN Admin</span>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className="admin-nav-link" style={linkStyle}>{n.label}</NavLink>)}
        </nav>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="admin-btn"
          style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'rgba(255,255,255,0.75)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
          }}
        >Log out</button>
        <NavLink to="/" className="admin-nav-link" style={{ display: 'block', marginTop: 10, fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Back to site</NavLink>
      </div>
      <div style={{ background: BG, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 32px 80px' }} className="fade-up" key={location.pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
