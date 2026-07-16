function TrafficLights() {
  const dot = (bg) => (
    <div style={{ width: 12, height: 12, borderRadius: '50%', background: bg, border: '0.5px solid rgba(0,0,0,0.1)' }} />
  );
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {dot('#ff5f57')}{dot('#febc2e')}{dot('#28c840')}
    </div>
  );
}

export default function MacWindowFrame({ width = 640, height = 420, title = 'Window', screenshot, alt = '', focalX = 50, focalY = 50, zoom = 1, children }) {
  return (
    <div
      style={{
        width, height, borderRadius: 14, overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.16), 0 24px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{
        height: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
        background: '#F1F2F4', borderBottom: '1px solid rgba(11,18,32,0.06)', flexShrink: 0,
      }}>
        <TrafficLights />
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'rgba(11,18,32,0.55)',
          marginRight: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {screenshot ? (
          <img src={screenshot} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focalX}% ${focalY}%`, transform: `scale(${zoom})`, display: 'block' }} />
        ) : children}
      </div>
    </div>
  );
}
