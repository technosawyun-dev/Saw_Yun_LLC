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
const TOKEN_KEY = 'sawyun_admin_token';

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
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

export { TOKEN_KEY };
export default client;
