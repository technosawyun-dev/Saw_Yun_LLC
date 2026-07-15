import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FONT_HEAD } from '../styles/theme';

const headingStyle = { fontSize: 12.5, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', marginBottom: 16 };
const linkStyle = { display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 12, cursor: 'pointer' };

export default function Footer() {
  return (
    <div className="footer-section">
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="footer-grid">
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src={logo} alt="Saw Yun" style={{ height: 28, width: 28, objectFit: 'contain' }} />
              <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: '#fff' }}>SAW YUN</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>
              A software house building custom software and digital products for startups and enterprises.
            </div>
          </div>
          <div>
            <div style={headingStyle}>Company</div>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/services" style={linkStyle}>Services</Link>
            <Link to="/projects" style={linkStyle}>Projects</Link>
            <Link to="/about" style={linkStyle}>About</Link>
          </div>
          <div>
            <div style={headingStyle}>Get in touch</div>
            <div style={linkStyle}>hello@sawyun.com</div>
            <div style={linkStyle}>Remote-first · Worldwide</div>
            <Link to="/contact" style={linkStyle}>Contact us →</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 40, paddingTop: 24, fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Saw Yun LLC. All rights reserved.
        </div>
      </div>
    </div>
  );
}
