export default function AndroidFrame({ width = 340, height = 700, screenshot, alt = '', focalX = 50, focalY = 50, zoom = 1, children }) {
  return (
    <div
      style={{
        width, height, borderRadius: 18, overflow: 'hidden', position: 'relative',
        background: '#f4fbf8',
        border: '8px solid rgba(116,119,117,0.5)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{
        position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
        width: 20, height: 20, borderRadius: '50%', background: '#2e2e2e', zIndex: 50,
      }} />
      <div style={{ width: '100%', height: '100%' }}>
        {screenshot ? (
          <img src={screenshot} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focalX}% ${focalY}%`, transform: `scale(${zoom})`, display: 'block' }} />
        ) : children}
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ width: 90, height: 3.5, borderRadius: 100, background: 'rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  );
}
