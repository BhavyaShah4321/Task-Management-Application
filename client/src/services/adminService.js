import api from './api';

const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data.data.stats;
};

const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data.data.users;
};

const getAdminTasks = async (params) => {
  const response = await api.get('/admin/tasks', { params });
  return response.data.data;
};

const assignTask = async (data) => {
  const response = await api.post('/admin/tasks', data);
  return response.data.data.task;
};

const adminService = { getAdminStats, getAdminUsers, getAdminTasks, assignTask };

export default adminService;
