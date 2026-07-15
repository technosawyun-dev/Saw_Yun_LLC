import { NAVY, MUTED, BLUE, LINE, FONT_HEAD, cardStyle } from '../styles/theme';

const VALUES = [
  ['Craftsmanship', 'We sweat the details other teams skip — because those details are what users notice.'],
  ['Reliability', "Software that runs a business has to work every day — that's the bar we build to."],
  ['Transparency', 'You see real progress every week — no black-box timelines or surprise scope.'],
  ['Partnership', 'We stay past launch — your roadmap becomes something we build alongside you.'],
];

const TEAM = [
  ['Founder & Engineering Lead', 'Architecture & delivery'],
  ['Product & Design Lead', 'UX & interfaces'],
  ['Client Success', 'Support & partnerships'],
];

export default function About() {
  return (
    <div data-screen-label="About" className="fade-up">
      <div className="page-header">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 12 }}>ABOUT</div>
        <h1 className="page-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, letterSpacing: -1, margin: '0 0 16px', color: NAVY }}>
          Small team, real software
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: MUTED, maxWidth: 640, margin: 0 }}>
          Saw Yun LLC is a software house building practical, reliable systems for growing businesses — from custom platforms to the point-of-sale software that runs day-to-day operations.
        </p>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 20px' }}>
        <div className="values-grid">
          {VALUES.map(([title, desc]) => (
            <div key={title} style={cardStyle} className="hoverable-card">
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, color: NAVY, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: MUTED }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 90px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 10 }}>THE TEAM</div>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 30, letterSpacing: -0.6, margin: 0, color: NAVY }}>The people behind Saw Yun</h2>
        </div>
        <div className="team-grid">
          {TEAM.map(([role, focus]) => (
            <div key={role} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: '32px 20px', textAlign: 'center' }} className="hoverable-card">
              <div style={{
                width: 88, height: 88, margin: '0 auto 16px', borderRadius: '50%',
                background: 'linear-gradient(135deg,rgba(34,211,238,0.15),rgba(123,47,247,0.15))',
                border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: MUTED, textAlign: 'center', padding: 8,
              }}>Photo</div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: NAVY }}>{role}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{focus}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
