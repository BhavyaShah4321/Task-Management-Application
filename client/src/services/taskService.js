import api from './api';

const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data.data.tasks;
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
