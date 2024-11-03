import axios from 'axios';
import { API_URL } from './constants';


export const getItems = async () => {
    return []
//   const response = await axios.get(`${API_URL}/items/`);
//   return response.data;
};

export const register = async (username, password) => {
    return axios.post(`${API_URL}/register/`, { username, password });
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    console.log('response', response)
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
return response.data;
};


export const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post(`${API_URL}/logout/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem('token');
    }
  };


export const getToken = () => {
    return localStorage.getItem('token');
};
