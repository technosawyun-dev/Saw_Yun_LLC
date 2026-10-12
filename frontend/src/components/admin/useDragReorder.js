import { useRef, useState } from 'react';
import { updateProject } from '../../api/projects';

// Drag-to-reorder for an admin list. Rows move live while dragging; the new order is saved when the
// row is dropped (sort_order = position, only for rows whose number changed). If saving fails, the
// list is reloaded so the screen always matches what the website shows.
export default function useDragReorder(items, setItems, reload, onError) {
  const [dragId, setDragId] = useState(null);
  const startOrder = useRef(null);

  const rowProps = (id) => ({
    draggable: true,
    onDragStart: (e) => {
      setDragId(id);
      startOrder.current = items.map((x) => x.id).join(',');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(id));
    },
    onDragOver: (e) => {
      e.preventDefault();
      if (dragId === null || dragId === id) return;
      const from = items.findIndex((x) => x.id === dragId);
      const to = items.findIndex((x) => x.id === id);
      if (from < 0 || to < 0) return;
      const next = items.slice();
      next.splice(to, 0, next.splice(from, 1)[0]);
      setItems(next);
    },
    onDrop: (e) => e.preventDefault(),
    onDragEnd: async () => {
      setDragId(null);
      if (items.map((x) => x.id).join(',') === startOrder.current) return;
      try {
        await Promise.all(
          items.map((x, i) => (x.sort_order === i + 1 ? null : updateProject(x.id, { sort_order: i + 1 }))),
        );
        setItems(items.map((x, i) => ({ ...x, sort_order: i + 1 })));
      } catch {
        onError('Could not save the new order. Showing the saved order again.');
        reload();
      }
    },
  });

  return { dragId, rowProps };
}
