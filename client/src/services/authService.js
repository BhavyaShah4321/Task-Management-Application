import api from './api';

const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const authService = { registerUser, loginUser, getCurrentUser };

export default authService;
