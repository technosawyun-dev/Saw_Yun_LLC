import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { NAVY, MUTED, BLUE, LINE, GRADIENT, NAV_BG, FONT_HEAD, FONT_BODY } from '../styles/theme';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    fontSize: 14.5, fontWeight: 700, color: isActive ? NAVY : MUTED, textDecoration: 'none',
    padding: '8px 4px', borderBottom: isActive ? `2px solid ${BLUE}` : '2px solid transparent',
    transition: 'color .2s ease',
  });

  const linkStyleMobile = ({ isActive }) => ({
    fontSize: 15.5, fontWeight: 700, color: isActive ? BLUE : NAVY, textDecoration: 'none',
    padding: '12px 6px', display: 'block', borderBottom: `1px solid ${LINE}`,
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: NAV_BG, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${LINE}`,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '14px 32px',
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Saw Yun" style={{ height: 34, width: 34, objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19, letterSpacing: -0.3, color: NAVY }}>SAW YUN</span>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 2, color: MUTED }}>LLC · SOFTWARE HOUSE</span>
          </div>
        </div>

        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} style={linkStyle}>{l.label}</NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            className="nav-cta-desktop"
            onClick={() => navigate('/contact')}
            style={{
              padding: '11px 22px', borderRadius: 10, border: 'none', background: GRADIENT, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: FONT_BODY,
              boxShadow: '0 10px 24px -10px rgba(61,107,255,0.5)', transition: 'transform .15s ease',
            }}
          >Start a project</button>
          <div
            className="nav-hamburger"
            onClick={() => setNavOpen((o) => !o)}
            style={{ display: 'none', flexDirection: 'column', gap: 5, width: 26, cursor: 'pointer', padding: 6 }}
          >
            <div style={{ height: 2, width: '100%', background: NAVY, borderRadius: 2, transition: 'transform .25s ease', transform: navOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <div style={{ height: 2, width: '100%', background: NAVY, borderRadius: 2, opacity: navOpen ? 0 : 1, transition: 'opacity .2s ease' }} />
            <div style={{ height: 2, width: '100%', background: NAVY, borderRadius: 2, transition: 'transform .25s ease', transform: navOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </div>
        </div>
      </div>

      {navOpen && (
        <div className="nav-mobile-menu" style={{
          display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 24px 20px',
          borderTop: `1px solid ${LINE}`, animation: 'fadeUp .3s ease both',
        }}>
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} style={linkStyleMobile} onClick={() => setNavOpen(false)}>{l.label}</NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
