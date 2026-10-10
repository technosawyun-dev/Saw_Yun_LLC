import axios from 'axios';

// Empty string = same-origin, relative requests (e.g. "/api/projects").
// Local dev relies on this: vite.config.js proxies /api and /uploads to the
// backend, so the browser only ever talks to whatever origin served the
// page — necessary for the app to work when accessed via a tunnel/another
// device, where "http://localhost:8000" would mean *that device's* own
// localhost, not this machine's. Production (Vercel) has no such proxy, so
// VITE_API_URL must be set there to the backend's real public URL — see
// frontend/.env.example.
export const API_BASE = import.meta.env.VITE_API_URL || '';
// The admin login itself lives in an HttpOnly cookie that the server sets: page scripts (including any
// injected by an attacker) can never read it. This flag is NOT a secret - it only tells the UI whether to
// show the admin area or the sign-in page. If it is stale, the first API call returns 401 and clears it.
const SESSION_FLAG = 'sawyun_admin_session';
try { localStorage.removeItem('sawyun_admin_token'); } catch { /* old versions kept the token here */ }

// withCredentials: send the login cookie to the API (a different origin on the same site).
const client = axios.create({ baseURL: API_BASE, withCredentials: true });

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(SESSION_FLAG);
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export function imageUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_BASE}${path}`;
}

export { SESSION_FLAG };
export default client;
