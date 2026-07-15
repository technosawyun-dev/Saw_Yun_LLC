export const NAVY = '#0B1220';
export const MUTED = '#5B6472';
export const BG = '#CBCEDC';
export const NAV_BG = 'rgba(203,206,220,0.75)';
export const MOCK_SCREEN_BG = '#E7E9F2';
export const BLUE = '#3D6BFF';
export const CYAN = '#22D3EE';
export const VIOLET = '#7B2FF7';
export const GRADIENT = 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)';
export const LINE = 'rgba(11,18,32,0.08)';

export const PAGE_GRADIENT_WASH_STYLE = {
  position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
  background: [
    'radial-gradient(900px 620px at 12% 0%, rgba(61,107,255,0.24), transparent 60%)',
    'radial-gradient(800px 600px at 88% 18%, rgba(123,47,247,0.20), transparent 60%)',
    'radial-gradient(700px 700px at 50% 70%, rgba(34,211,238,0.16), transparent 55%)',
    'linear-gradient(180deg, #D7DAE6 0%, #CBCEDC 40%, #C0C3D4 100%)',
  ].join(', '),
};

export const PAGE_DOT_GRID_STYLE = {
  position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6,
  backgroundImage: 'radial-gradient(rgba(11,18,32,0.09) 1px, transparent 1px)',
  backgroundSize: '26px 26px',
};

export const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
export const FONT_HEAD = "'Space Grotesk', sans-serif";

export const iconWrap = (bg, fg) => ({
  width: 46, height: 46, borderRadius: 12, background: bg, color: fg,
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .4s ease',
});

export const serviceIconWrapBlue = iconWrap('rgba(61,107,255,0.1)', BLUE);
export const serviceIconWrapCyan = iconWrap('rgba(34,211,238,0.12)', '#0891a8');
export const serviceIconWrapViolet = iconWrap('rgba(123,47,247,0.1)', VIOLET);

export const cardStyle = {
  background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: 26,
  transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
};
export const cardHoverLift = { transform: 'translateY(-6px)', boxShadow: '0 24px 44px -24px rgba(11,18,32,0.22)' };

export const primaryBtnStyle = {
  padding: '15px 28px', border: 'none', borderRadius: 12, background: GRADIENT, color: '#fff',
  fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15, cursor: 'pointer',
  boxShadow: '0 12px 28px -10px rgba(61,107,255,0.55)', transition: 'transform .2s ease',
};

export const secondaryBtnStyle = {
  padding: '15px 28px', border: `1px solid rgba(11,18,32,0.14)`, borderRadius: 12, background: '#fff',
  color: NAVY, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15, cursor: 'pointer',
  transition: 'transform .2s ease, border-color .2s ease',
};

export const liveDemoButtonStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100,
  background: NAVY, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none',
  transition: 'transform .2s ease, background .2s ease',
};

export const PLATFORMS = [
  { key: 'ios', label: 'iOS' },
  { key: 'android', label: 'Android' },
  { key: 'web', label: 'Web' },
  { key: 'windows', label: 'Windows' },
];

export const PLATFORM_NOTES = {
  ios: { title: 'iOS', notes: [
    'Native SwiftUI app tuned for quick single-hand checkout.',
    'Offline-first — sales keep working without a connection.',
    'Apple Pay and card-reader hardware support built in.',
  ] },
  android: { title: 'Android', notes: [
    'Material 3 app built for handheld and tablet counters.',
    'Works across a wide range of retail hardware.',
    'Syncs instantly with the web back office.',
  ] },
  web: { title: 'Web', notes: [
    'Full back-office dashboard — inventory, staff, reporting.',
    'Runs in any browser, no install required.',
    'Real-time sync across every connected till.',
  ] },
  windows: { title: 'Windows', notes: [
    'Native desktop app for dedicated checkout counters.',
    'Built for receipt printers and barcode scanners.',
    'Runs reliably on standard retail hardware.',
  ] },
};
