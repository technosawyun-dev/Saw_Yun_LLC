import { MUTED } from '../../styles/theme';

export default function DragGrip() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true" style={{ flexShrink: 0, color: MUTED, opacity: 0.7 }} title="Drag to reorder">
      {[4, 10, 16].flatMap((y) => [3, 10].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" />))}
    </svg>
  );
}
