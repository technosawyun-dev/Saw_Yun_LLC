import IOSFrame from './IOSFrame';
import AndroidFrame from './AndroidFrame';
import BrowserWindowFrame from './BrowserWindowFrame';
import MacWindowFrame from './MacWindowFrame';

export const FRAME_BY_PLATFORM = {
  ios: IOSFrame,
  android: AndroidFrame,
  web: BrowserWindowFrame,
  windows: MacWindowFrame,
};

// Same aspect ratio as each frame component's own defaults (320x660,
// 340x700, 640x420) — only the absolute size is scaled down for compact
// admin previews, so the crop shown here always matches the live site.
export const FRAME_PREVIEW_SIZE = {
  ios: { width: 130, height: 268 },
  android: { width: 138, height: 284 },
  web: { width: 220, height: 144 },
  windows: { width: 220, height: 144 },
};

export const FRAME_MODAL_SIZE = {
  ios: { width: 200, height: 412 },
  android: { width: 210, height: 432 },
  web: { width: 340, height: 223 },
  windows: { width: 340, height: 223 },
};
