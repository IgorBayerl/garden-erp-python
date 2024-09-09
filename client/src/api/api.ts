import axios from 'axios';

export const BASE_SERVER_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: encodeURI(BASE_SERVER_URL + '/api'),
  timeout: 5000,
});

export default api;
