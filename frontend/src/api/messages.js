import client from './client';

export const listMessages = () => client.get('/api/admin/messages').then((r) => r.data);

export const markMessageRead = (id) => client.patch(`/api/admin/messages/${id}`).then((r) => r.data);

export const deleteMessage = (id) => client.delete(`/api/admin/messages/${id}`);
