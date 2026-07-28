import api from './api';

// params: { page, limit, search, status, priority, sortBy, sortOrder }
const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data.data; // { tasks, pagination }
};

const createTask = async (data) => {
  const response = await api.post('/tasks', data);
  return response.data.data.task;
};

const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.data.task;
};

const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
};

const taskService = { getTasks, createTask, updateTask, deleteTask };

export default taskService;
