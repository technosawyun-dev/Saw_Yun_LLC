const C = { barBg: '#202124', tabBg: '#35363a', text: '#e8eaed', dim: '#9aa0a6', urlBg: '#282a2d' };

function TrafficLights() {
  const dot = (bg) => <div style={{ width: 11, height: 11, borderRadius: '50%', background: bg }} />;
  return (
    <div style={{ display: 'flex', gap: 7, padding: '0 12px' }}>
      {dot('#ff5f57')}{dot('#febc2e')}{dot('#28c840')}
    </div>
  );
}

export default function BrowserWindowFrame({ width = 640, height = 420, url = 'app.sawyunpos.com', screenshot, alt = '', focalX = 50, focalY = 50, zoom = 1, children }) {
  return (
    <div
      style={{
        width, height, borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.32), 0 0 0 1px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', background: C.tabBg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ height: 36, display: 'flex', alignItems: 'center', background: C.barBg, flexShrink: 0 }}>
        <TrafficLights />
      </div>
      <div style={{ height: 36, background: C.tabBg, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', flexShrink: 0 }}>
        <div style={{
          flex: 1, height: 24, borderRadius: 12, background: C.urlBg,
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px',
        }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.dim, opacity: 0.5 }} />
          <span style={{ fontSize: 12, color: C.text }}>{url}</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#fff', overflow: 'hidden' }}>
        {screenshot ? (
          <img src={screenshot} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focalX}% ${focalY}%`, transform: `scale(${zoom})`, display: 'block' }} />
        ) : children}
      </div>
    </div>
  );
}
