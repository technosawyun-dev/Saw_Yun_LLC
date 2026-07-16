export default function IOSFrame({ width = 320, height = 660, screenshot, alt = '', focalX = 50, focalY = 50, zoom = 1, children }) {
  return (
    <div
      style={{
        width, height, borderRadius: 40, overflow: 'hidden', position: 'relative',
        background: '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 100, height: 30, borderRadius: 20, background: '#000', zIndex: 50,
      }} />
      <div style={{ width: '100%', height: '100%' }}>
        {screenshot ? (
          <img src={screenshot} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focalX}% ${focalY}%`, transform: `scale(${zoom})`, display: 'block' }} />
        ) : children}
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 7, pointerEvents: 'none',
      }}>
        <div style={{ width: 112, height: 4, borderRadius: 100, background: 'rgba(0,0,0,0.25)' }} />
      </div>
    </div>
  );
}
