import axios from 'axios';
import { API_URL } from './constants';


export const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const register = async (username, password) => {
    return await api.post(`/register/`, { username, password });
};


export const getToken = () => {
    return localStorage.getItem('token');
};
