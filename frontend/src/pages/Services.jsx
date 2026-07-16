import { useNavigate } from 'react-router-dom';
import { NAVY, MUTED, BLUE, LINE, BG, FONT_HEAD, cardStyle } from '../styles/theme';

const PRICING = [
  {
    title: 'Fixed-Scope Project',
    desc: 'A defined deliverable, timeline and price — ideal for a single product like a POS rollout.',
    items: ['Fixed timeline & budget', 'Dedicated project lead', 'Weekly milestone demos'],
    featured: false,
  },
  {
    title: 'Dedicated Team',
    desc: 'An embedded squad of engineers and designers working as an extension of your team.',
    items: ['Monthly billing, scale up or down', 'Direct access to your engineers', 'Shared roadmap & standups'],
    featured: true,
  },
  {
    title: 'Ongoing Retainer',
    desc: 'Continuous maintenance, updates and support once your product is live.',
    items: ['Priority bug fixes', 'Monthly feature releases', 'Uptime & performance monitoring'],
    featured: false,
  },
];

const badge = (text, style = {}) => (
  <div style={{ width: 18, height: 18, borderRadius: 5, color: '#fff', fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", ...style }}>{text}</div>
);

const TECH = [
  {
    label: 'React',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.2" fill="#149ECA" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#149ECA" strokeWidth="1.4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#149ECA" strokeWidth="1.4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#149ECA" strokeWidth="1.4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    label: 'Node.js',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="#5FA04E" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  { label: 'TypeScript', icon: badge('TS', { background: '#3178C6', fontSize: 9.5 }) },
  { label: 'Swift', icon: badge('S', { background: '#F05138', fontSize: 11 }) },
  { label: 'Kotlin', icon: badge('K', { background: 'linear-gradient(135deg,#E44857,#C711E1 45%,#7F52FF)', fontSize: 10.5 }) },
  { label: 'PostgreSQL', icon: badge('Pg', { background: '#336791', borderRadius: '50%', fontSize: 8.5 }) },
  { label: 'AWS', icon: badge('aws', { background: '#232F3E', color: '#FF9900', width: 20, fontSize: 8 }) },
  {
    label: 'Docker',
    icon: (
      <svg width="20" height="16" viewBox="0 0 28 20" fill="none">
        <rect x="1" y="7" width="4.5" height="4.5" fill="#2496ED" />
        <rect x="6.5" y="7" width="4.5" height="4.5" fill="#2496ED" />
        <rect x="12" y="7" width="4.5" height="4.5" fill="#2496ED" />
        <rect x="6.5" y="1.5" width="4.5" height="4.5" fill="#2496ED" />
        <rect x="12" y="1.5" width="4.5" height="4.5" fill="#2496ED" />
        <path d="M0 12C0 12 2 15 8 15C16 15 19 12 21 8H0V12Z" fill="#2496ED" />
      </svg>
    ),
  },
];

const SERVICES = [
  { title: 'Custom Software Development', desc: 'End-to-end platforms designed and engineered around your exact workflow — not a generic template.' },
  { title: 'POS & Retail Systems', desc: 'Point-of-sale software for single counters or multi-branch chains, on mobile, web, Windows and iOS.' },
  { title: 'Mobile App Development', desc: 'Native iOS and Android apps, from first prototype to app-store launch and beyond.' },
  { title: 'Web Application Development', desc: 'Fast, responsive web apps and dashboards built to scale with your users.' },
  { title: 'Desktop & Windows Applications', desc: 'Native desktop software for teams that live outside the browser.' },
  { title: 'Cloud & DevOps', desc: 'Infrastructure, CI/CD and monitoring so releases are routine, not risky.' },
  { title: 'UI/UX Design', desc: 'Interfaces that are clear, fast to use, and consistent across every platform.' },
  { title: 'Maintenance & Support', desc: 'Ongoing fixes, updates and monitoring once your product is live in the world.' },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div data-screen-label="Services" className="fade-up">
      <div className="page-header">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 12 }}>ENGAGEMENT MODELS</div>
        <h1 className="page-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, letterSpacing: -1, margin: '0 0 16px', color: NAVY }}>
          Work with us the way you need to
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: MUTED, maxWidth: 600, margin: 0 }}>
          From a single custom build to a fully staffed product team — we scope engagements around what you actually need next.
        </p>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 20px' }}>
        <div className="pricing-grid">
          {PRICING.map((p) => (
            p.featured ? (
              <div key={p.title} style={{ position: 'relative', background: NAVY, borderRadius: 18, padding: 30 }}>
                <div style={{ position: 'absolute', top: -13, left: 24, padding: '5px 12px', borderRadius: 100, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)', color: '#fff', fontSize: 11.5, fontWeight: 700 }}>MOST FLEXIBLE</div>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19, color: '#fff', marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 20 }}>{p.desc}</div>
                {p.items.map((it) => <div key={it} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginBottom: 10 }}>✓ {it}</div>)}
                <button onClick={() => navigate('/contact')} style={{ width: '100%', marginTop: 14, padding: '13px 0', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff' }}>Get a quote</button>
              </div>
            ) : (
              <div key={p.title} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: 30 }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19, color: NAVY, marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 20 }}>{p.desc}</div>
                {p.items.map((it) => <div key={it} style={{ fontSize: 13.5, color: MUTED, fontWeight: 600, marginBottom: 10 }}>✓ {it}</div>)}
                <button onClick={() => navigate('/contact')} style={{ width: '100%', marginTop: 14, padding: '13px 0', borderRadius: 10, border: `1px solid ${LINE}`, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: BG, color: NAVY }}>Get a quote</button>
              </div>
            )
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0 20px' }}>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: MUTED, marginBottom: 22 }}>OUR TECH STACK</div>
        <div className="marquee-mask">
          <div className="marquee-track" style={{ animation: 'marqueeThree 26s linear infinite' }}>
            {Array.from({ length: 3 }).flatMap((_, rep) =>
              TECH.map((t) => (
                <div key={`${rep}-${t.label}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px 10px 14px', borderRadius: 100, background: '#fff', border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: NAVY, whiteSpace: 'nowrap' }}>
                  {t.icon}{t.label}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="services-header">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 12 }}>SERVICES</div>
        <h1 className="page-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, letterSpacing: -1, margin: '0 0 16px', color: NAVY }}>
          Everything you need to ship real software
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: MUTED, maxWidth: 600, margin: 0 }}>
          From a single custom build to a fully staffed product team — we scope engagements around what you actually need next.
        </p>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 20px' }}>
        <div className="services-grid">
          {SERVICES.map((s) => (
            <div key={s.title} style={cardStyle} className="hoverable-card">
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, margin: '0 0 8px', color: NAVY }}>{s.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: MUTED }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
