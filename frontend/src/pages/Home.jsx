import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import IOSFrame from '../components/devices/IOSFrame';
import AndroidFrame from '../components/devices/AndroidFrame';
import MacWindowFrame from '../components/devices/MacWindowFrame';
import BrowserWindowFrame from '../components/devices/BrowserWindowFrame';
import { POSMobileMockSimple, POSDesktopMockSimple } from '../components/PosMocks';
import {
  NAVY, MUTED, BLUE, CYAN, VIOLET, LINE, FONT_HEAD, FONT_BODY,
  primaryBtnStyle, secondaryBtnStyle, serviceIconWrapBlue, serviceIconWrapCyan, serviceIconWrapViolet,
  cardStyle, cardHoverLift,
} from '../styles/theme';

const HERO_ORDER = ['ios', 'windows', 'tablet', 'web'];
const HERO_LABELS = { ios: 'Mobile', windows: 'Windows', tablet: 'Tablet', web: 'Web' };

const SERVICES = [
  { icon: serviceIconWrapBlue, title: 'Custom Software', desc: 'Tailored systems designed around how your business actually operates.',
    path: <path d="M9 4L4 12L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />, path2: <path d="M15 4L20 12L15 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
  { icon: serviceIconWrapCyan, title: 'POS & Retail Systems', desc: 'Point-of-sale software for mobile, web, Windows and iOS — one system, every counter.',
    rect: true },
  { icon: serviceIconWrapViolet, title: 'Mobile Apps', desc: 'Native iOS and Android apps built for speed, polish and real daily use.', phone: true },
  { icon: serviceIconWrapBlue, title: 'Cloud & DevOps', desc: 'Infrastructure, deployment and monitoring so your product stays online.', cloud: true },
];

function ServiceIcon({ s }) {
  if (s.rect) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M3 10H21" stroke="currentColor" strokeWidth="2" /><path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (s.phone) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="2" /><path d="M11 19H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (s.cloud) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 18H17.5C19.4 18 21 16.4 21 14.5C21 12.6 19.4 11 17.5 11C17.4 11 17.3 11 17.2 11C16.7 8.7 14.6 7 12 7C9.1 7 6.7 9.1 6.2 11.8C4.4 12.1 3 13.7 3 15.6C3 17.5 4.6 18 7 18Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{s.path}{s.path2}</svg>;
}

const PLATFORM_PILLS = [
  { label: 'iOS', color: CYAN }, { label: 'Android', color: BLUE }, { label: 'Web', color: VIOLET }, { label: 'Windows', color: NAVY },
];

export default function Home() {
  const navigate = useNavigate();
  const [heroPlatform, setHeroPlatform] = useState('ios');
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroPlatform((p) => HERO_ORDER[(HERO_ORDER.indexOf(p) + 1) % HERO_ORDER.length]);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div data-screen-label="Home" className="fade-up">
      {/* Hero */}
      <div className="hero-section">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={logo} alt="Saw Yun" style={{ width: 44, height: 44, objectFit: 'contain', marginBottom: 16 }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 100, background: 'rgba(61,107,255,0.08)', border: '1px solid rgba(61,107,255,0.18)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#22D3EE,#7B2FF7)', animation: 'pulseGlow 2.4s ease-in-out infinite' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: BLUE, letterSpacing: 0.3 }}>SOFTWARE HOUSE · SAAS PARTNER</span>
          </div>
          <h1 className="hero-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, margin: '20px 0 0', color: NAVY }}>
            We build the software that runs{' '}
            <span style={{ background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>your business.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: MUTED, margin: '22px 0 0', maxWidth: 560 }}>
            Saw Yun LLC designs and engineers custom software for startups and enterprises — from web and mobile apps to point-of-sale systems and beyond, from first sketch to production.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/projects')} style={primaryBtnStyle}>View our work</button>
            <button onClick={() => navigate('/contact')} style={secondaryBtnStyle}>Start a project</button>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['4', 'Platforms shipped'], ['1', 'Flagship product live'], ['More', 'In active development']].map(([n, l], i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                {i > 0 && <div style={{ width: 1, height: 30, background: 'rgba(11,18,32,0.1)' }} />}
                <div>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 26, color: NAVY }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 28 }}>
            {[
              { label: 'Custom Software', icon: serviceIconWrapBlue, svg: <><path d="M9 4L4 12L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 4L20 12L15 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></> },
              { label: 'Mobile, Web & POS', icon: serviceIconWrapViolet, svg: <><rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="2" /><path d="M11 19H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
              { label: 'Cloud & DevOps', icon: serviceIconWrapCyan, svg: <path d="M7 18H17.5C19.4 18 21 16.4 21 14.5C21 12.6 19.4 11 17.5 11C17.4 11 17.3 11 17.2 11C16.7 8.7 14.6 7 12 7C9.1 7 6.7 9.1 6.2 11.8C4.4 12.1 3 13.7 3 15.6C3 17.5 4.6 18 7 18Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px 9px 10px', borderRadius: 100, background: '#fff', border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: NAVY }}>
                <div style={{ ...c.icon, width: 28, height: 28, borderRadius: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">{c.svg}</svg>
                </div>
                {c.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform marquee */}
      <div style={{ padding: '20px 0 48px' }}>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: MUTED, marginBottom: 22 }}>ONE PRODUCT · FOUR PLATFORMS</div>
        <div className="marquee-mask">
          <div className="marquee-track" style={{ animation: 'marqueeSix 26s linear infinite' }}>
            {Array.from({ length: 6 }).flatMap((_, rep) =>
              PLATFORM_PILLS.map((p) => (
                <div key={`${rep}-${p.label}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 100, background: '#fff', border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: NAVY, whiteSpace: 'nowrap' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />{p.label}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 10 }}>WHAT WE DO</div>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 34, letterSpacing: -0.8, margin: 0, color: NAVY }}>Services built for growing businesses</h2>
          </div>
          <a onClick={() => navigate('/services')} style={{ fontWeight: 700, color: BLUE, textDecoration: 'none', fontSize: 15, whiteSpace: 'nowrap', cursor: 'pointer' }}>View all services →</a>
        </div>
        <div className="home-services-grid">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              style={hoveredService === s.title ? { ...cardStyle, ...cardHoverLift, borderColor: 'rgba(61,107,255,0.25)' } : cardStyle}
              onMouseEnter={() => setHoveredService(s.title)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div style={s.icon}><ServiceIcon s={s} /></div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, margin: '16px 0 8px', color: NAVY }}>{s.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: MUTED }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Work (dark band) */}
      <div style={{ background: NAVY, padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(61,107,255,0.25),transparent 70%)', filter: 'blur(20px)' }} />
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div className="featured-grid">
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: '#7dd8ff', marginBottom: 14 }}>FEATURED WORK</div>
              <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 32, letterSpacing: -0.6, margin: '0 0 16px', color: '#fff' }}>Saw Yun POS</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px', maxWidth: 460 }}>
                Our flagship product: a point-of-sale system for retail and hospitality, built once and shipped natively to iOS, Android, Web and Windows — so a single café counter or a multi-branch chain runs on the same system.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                {['iOS', 'Android', 'Web', 'Windows'].map((b) => (
                  <span key={b} style={{ padding: '6px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{b}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/projects/saw-yun-pos')}
                  style={{ padding: '14px 24px', border: 'none', borderRadius: 11, background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
                >View case study →</button>
              </div>
            </div>
            <div style={{ overflow: 'visible', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320 }}>
              <div className="fade-up" key={heroPlatform} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {heroPlatform === 'ios' && (
                  <div style={{ transform: 'scale(0.485)', transformOrigin: 'center' }}><IOSFrame><POSMobileMockSimple /></IOSFrame></div>
                )}
                {heroPlatform === 'tablet' && (
                  <div style={{ transform: 'scale(0.457)', transformOrigin: 'center' }}><AndroidFrame><POSMobileMockSimple /></AndroidFrame></div>
                )}
                {heroPlatform === 'windows' && (
                  <div style={{ transform: 'scale(0.762)', transformOrigin: 'center' }}><MacWindowFrame title="Saw Yun POS"><POSDesktopMockSimple /></MacWindowFrame></div>
                )}
                {heroPlatform === 'web' && (
                  <div style={{ transform: 'scale(0.762)', transformOrigin: 'center' }}><BrowserWindowFrame url="app.sawyunpos.com"><POSDesktopMockSimple /></BrowserWindowFrame></div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{HERO_LABELS[heroPlatform]}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {HERO_ORDER.map((p) => (
                    <span key={p} style={{ width: 7, height: 7, borderRadius: '50%', background: p === heroPlatform ? CYAN : 'rgba(255,255,255,0.2)', transition: 'background .3s ease' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 10 }}>HOW WE WORK</div>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 32, letterSpacing: -0.6, margin: 0, color: NAVY }}>From idea to production</h2>
        </div>
        <div className="process-grid">
          {[
            ['01', 'Discover', 'We learn your workflow, users and constraints before writing a line of spec.'],
            ['02', 'Design', 'Flows and interfaces get shaped and reviewed with you before a single build starts.'],
            ['03', 'Build', 'Engineering in short, visible cycles — you see working software every week.'],
            ['04', 'Launch & Support', 'We ship, then stay — monitoring, fixes and new features as you grow.'],
          ].map(([n, t, d]) => (
            <div key={n} style={{ padding: '0 8px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 14 }}>{n}</div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, margin: '16px 0 8px', color: NAVY }}>{t}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: MUTED }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
