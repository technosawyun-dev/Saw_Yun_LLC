import client from './client';

export const sendContact = (body) => client.post('/api/contact', body).then((r) => r.data);
