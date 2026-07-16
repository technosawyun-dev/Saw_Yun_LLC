import client from './client';

export const listProjects = () => client.get('/api/projects').then((r) => r.data);

export const getProject = (slug) => client.get(`/api/projects/${slug}`).then((r) => r.data);

export const getProjectByIdAdmin = (id) => client.get(`/api/admin/projects/${id}`).then((r) => r.data);

export const createProject = (body) => client.post('/api/admin/projects', body).then((r) => r.data);

export const updateProject = (id, body) => client.put(`/api/admin/projects/${id}`, body).then((r) => r.data);

export const deleteProject = (id) => client.delete(`/api/admin/projects/${id}`);

export const uploadScreenshot = (id, platform, file) => {
  const form = new FormData();
  form.append('platform', platform);
  form.append('file', file);
  return client
    .post(`/api/admin/projects/${id}/screenshots`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};

export const deleteScreenshot = (id, screenshotId) =>
  client.delete(`/api/admin/projects/${id}/screenshots/${screenshotId}`);

export const updateScreenshotPosition = (id, screenshotId, body) =>
  client.patch(`/api/admin/projects/${id}/screenshots/${screenshotId}`, body).then((r) => r.data);
