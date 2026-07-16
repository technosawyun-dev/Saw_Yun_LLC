import { useRef, useState } from 'react';
import { FRAME_BY_PLATFORM, FRAME_MODAL_SIZE } from '../devices/frameRegistry';
import { NAVY, MUTED, LINE, FONT_HEAD, FONT_BODY } from '../../styles/theme';

const ZOOM_MIN = 1;
const ZOOM_MAX = 2.5;

export default function ScreenshotAdjuster({ platform, imageSrc, initial, onSave, onCancel, saving }) {
  const [focalX, setFocalX] = useState(initial.focal_x ?? 50);
  const [focalY, setFocalY] = useState(initial.focal_y ?? 50);
  const [zoom, setZoom] = useState(initial.zoom ?? 1);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef(null);
  const frameRef = useRef(null);

  const Frame = FRAME_BY_PLATFORM[platform];
  const size = FRAME_MODAL_SIZE[platform];

  const onPointerDown = (e) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startY: e.clientY, focalX, focalY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const nextX = dragState.current.focalX - (dx / rect.width) * 100 / zoom;
    const nextY = dragState.current.focalY - (dy / rect.height) * 100 / zoom;
    setFocalX(Math.min(100, Math.max(0, nextX)));
    setFocalY(Math.min(100, Math.max(0, nextY)));
  };

  const onPointerUp = () => {
    dragState.current = null;
    setDragging(false);
  };

  const onReset = () => { setFocalX(50); setFocalY(50); setZoom(1); };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(11,18,32,0.6)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="modal-panel" style={{
        background: '#fff', borderRadius: 16, padding: 24, maxWidth: 440, width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        fontFamily: FONT_BODY, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ alignSelf: 'flex-start' }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: NAVY }}>Adjust screenshot</div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4 }}>
            Drag the image to reposition it and use the slider to zoom. This preview is exactly how it will look on the live site.
          </div>
        </div>

        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
        >
          <Frame screenshot={imageSrc} focalX={focalX} focalY={focalY} zoom={zoom} width={size.width} height={size.height} alt="" />
        </div>

        <div style={{ width: '100%' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: MUTED, display: 'block', marginBottom: 6 }}>Zoom</label>
          <input
            type="range" min={ZOOM_MIN} max={ZOOM_MAX} step="0.05" value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'space-between', marginTop: 4 }}>
          <button
            type="button" onClick={onReset} disabled={saving} className="admin-btn"
            style={{ padding: '10px 16px', borderRadius: 9, border: `1px solid ${LINE}`, background: '#fbfbfd', color: MUTED, fontWeight: 700, fontSize: 13, fontFamily: FONT_BODY, cursor: 'pointer' }}
          >Reset</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button" onClick={onCancel} disabled={saving} className="admin-btn"
              style={{ padding: '10px 18px', borderRadius: 9, border: `1px solid ${LINE}`, background: '#fff', color: NAVY, fontWeight: 700, fontSize: 13, fontFamily: FONT_BODY, cursor: 'pointer' }}
            >Cancel</button>
            <button
              type="button" disabled={saving} className="admin-btn admin-btn-primary"
              onClick={() => onSave({ focal_x: focalX, focal_y: focalY, zoom })}
              style={{
                padding: '10px 18px', borderRadius: 9, border: 'none',
                background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff',
                fontWeight: 700, fontSize: 13, fontFamily: FONT_BODY, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1,
              }}
            >{saving ? 'Saving…' : 'Save position'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
