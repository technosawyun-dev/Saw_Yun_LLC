import client, { TOKEN_KEY } from './client';

export const login = (email, password) =>
  client.post('/api/auth/login', { email, password }).then((r) => {
    localStorage.setItem(TOKEN_KEY, r.data.access_token);
    return r.data;
  });

export const logout = () => localStorage.removeItem(TOKEN_KEY);

export const isAuthed = () => !!localStorage.getItem(TOKEN_KEY);

export const getMe = () => client.get('/api/auth/me').then((r) => r.data);

export const changePassword = (currentPassword, newPassword) =>
  client.post('/api/auth/change-password', { current_password: currentPassword, new_password: newPassword });
