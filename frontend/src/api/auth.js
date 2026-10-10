import client, { SESSION_FLAG } from './client';

// The server answers with the login cookie (HttpOnly); we only remember "signed in" for the UI.
export const login = (email, password) =>
  client.post('/api/auth/login', { email, password }).then(() => {
    localStorage.setItem(SESSION_FLAG, '1');
  });

export const logout = () => {
  localStorage.removeItem(SESSION_FLAG);
  return client.post('/api/auth/logout').catch(() => {});
};

export const isAuthed = () => !!localStorage.getItem(SESSION_FLAG);

export const getMe = () => client.get('/api/auth/me').then((r) => r.data);

export const changePassword = (currentPassword, newPassword) =>
  client.post('/api/auth/change-password', { current_password: currentPassword, new_password: newPassword });
