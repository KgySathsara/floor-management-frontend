import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/tables', // Base URL for backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTables = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getTableById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createTable = async (table) => {
  const response = await api.post('/', table);
  return response.data;
};

export const updateTable = async (id, table) => {
  const response = await api.put(`/${id}`, table);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
