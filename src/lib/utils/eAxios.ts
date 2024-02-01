import axios from 'axios';

const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';
axios.defaults.baseURL = api;
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
const eAxios = axios;
export default eAxios;
