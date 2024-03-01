import axios from 'axios';

const eAxios = axios;
const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';
eAxios.defaults.baseURL = api;
eAxios.defaults.headers.common = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json', // Set content type to JSON
};

export default eAxios;
